import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { seedDatabase } from "./seed";
import path from "path";

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

// Serve attached assets
app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Flag to track if app is initialized
let isInitialized = false;

// Initialize the app (database, routes, etc.)
async function initializeApp() {
  if (isInitialized) return app;
  
  // Initialize database with sample data (only for PostgreSQL)
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('postgresql')) {
    await seedDatabase();
  }
  
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`Error on ${req.method} ${req.path}:`, err);
    
    // Don't send response if headers already sent
    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  // Only setup vite/static serving when not in Vercel serverless
  if (!process.env.VERCEL) {
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }
  }
  
  isInitialized = true;
  return app;
}

// Start server only when not running on Vercel
if (!process.env.VERCEL) {
  initializeApp().then(() => {
    const port = parseInt(process.env.PORT || '5000', 10);
    const host = process.env.NODE_ENV === 'development' ? 'localhost' : '0.0.0.0';
    
    app.listen(port, host, () => {
      log(`serving on ${host}:${port}`);
    });
  });
}

// Export for Vercel serverless
export { initializeApp };
export default app;
