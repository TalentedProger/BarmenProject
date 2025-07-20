import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import session from 'express-session';
import type { Express, RequestHandler } from 'express';
import connectPg from 'connect-pg-simple';
import { storage } from './storage';
import { nanoid } from 'nanoid';

// Session configuration
export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'cocktailo-session-secret-key',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: sessionTtl,
    },
  });
}

// Setup Google OAuth
export async function setupAuth(app: Express) {
  // Trust proxy for production
  app.set('trust proxy', 1);
  
  // Session middleware
  app.use(getSession());
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy - only initialize if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    const callbackURL = process.env.REPLIT_DOMAINS
      ? `https://${process.env.REPLIT_DOMAINS.split(',')[0]}/api/auth/google/callback`
      : "http://localhost:5000/api/auth/google/callback";
    
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: callbackURL
    }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user exists by Google ID
      let user = await storage.getUserByGoogleId(profile.id);
      
      if (!user) {
        // Check if user exists by email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await storage.getUserByEmail(email);
        }
        
        if (!user) {
          // Create new user
          user = await storage.upsertUser({
            id: nanoid(),
            googleId: profile.id,
            email: profile.emails?.[0]?.value || null,
            firstName: profile.name?.givenName || null,
            lastName: profile.name?.familyName || null,
            profileImageUrl: profile.photos?.[0]?.value || null,
          });
        } else {
          // Update existing user with Google ID
          user = await storage.upsertUser({
            ...user,
            googleId: profile.id,
            profileImageUrl: profile.photos?.[0]?.value || user.profileImageUrl,
          });
        }
      } else {
        // Update user info from Google
        user = await storage.upsertUser({
          ...user,
          email: profile.emails?.[0]?.value || user.email,
          firstName: profile.name?.givenName || user.firstName,
          lastName: profile.name?.familyName || user.lastName,
          profileImageUrl: profile.photos?.[0]?.value || user.profileImageUrl,
        });
      }
      
      return done(null, user);
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, null);
    }
  }));
  } else {
    console.warn('Google OAuth credentials not provided. Google authentication will be disabled.');
  }

  // Passport serialization
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Auth routes - only if Google OAuth is configured
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    app.get('/api/auth/google',
      passport.authenticate('google', { scope: ['profile', 'email'] })
    );

    app.get('/api/auth/google/callback',
      passport.authenticate('google', { failureRedirect: '/auth?error=google_auth_failed' }),
      (req, res) => {
        // Successful authentication, redirect to home
        res.redirect('/');
      }
    );
  } else {
    // Fallback routes when Google OAuth is not configured
    app.get('/api/auth/google', (req, res) => {
      res.redirect('/auth?error=google_oauth_not_configured');
    });
    
    app.get('/api/auth/google/callback', (req, res) => {
      res.redirect('/auth?error=google_oauth_not_configured');
    });
  }

  app.post('/api/auth/logout', (req, res) => {
    req.logout((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Failed to logout' });
      }
      req.session.destroy((err) => {
        if (err) {
          console.error('Session destroy error:', err);
        }
        res.clearCookie('connect.sid');
        res.json({ success: true });
      });
    });
  });

  // Guest login
  app.post('/api/auth/guest', async (req, res) => {
    try {
      const guestUser = await storage.upsertUser({
        id: nanoid(),
        email: null,
        firstName: 'Гость',
        lastName: null,
        profileImageUrl: null,
        googleId: null,
      });
      
      req.login(guestUser, (err) => {
        if (err) {
          console.error('Guest login error:', err);
          return res.status(500).json({ error: 'Failed to login as guest' });
        }
        res.json({ user: guestUser });
      });
    } catch (error) {
      console.error('Guest login error:', error);
      res.status(500).json({ error: 'Failed to create guest user' });
    }
  });
}

// Authentication middleware
export const isAuthenticated: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Optional authentication middleware (doesn't block if not authenticated)
export const optionalAuth: RequestHandler = (req, res, next) => {
  // Always proceed, auth info will be available in req.user if logged in
  next();
};