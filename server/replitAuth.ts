import session from "express-session";
import type { Express } from "express";
import MemoryStore from "memorystore";

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const MemStore = MemoryStore(session);
  const sessionStore = new MemStore({
    checkPeriod: sessionTtl
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-development',
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

export async function setupAuth(app: Express) {
  // Simplified demo auth system - no authentication required
  app.set("trust proxy", 1);
  
  // Add session middleware with memory store
  app.use(getSession());
  
  // Demo user endpoints
  app.get("/api/user", (req, res) => {
    // Return a demo user for the cocktail app
    res.json({
      id: "demo-user",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      profileImageUrl: null
    });
  });
  
  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });
  
  app.get("/api/login", (req, res) => {
    res.redirect("/");
  });
  
  app.get("/api/callback", (req, res) => {
    res.redirect("/");
  });
}

// Simplified auth middleware - always allows access
export const isAuthenticated = (req: any, res: any, next: any) => {
  next();
};
