import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For Replit migration: Allow running without database for in-memory storage mode
let db: any = null;
let pool: any = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else {
  console.log("No DATABASE_URL provided - running in memory storage mode");
  // Create a minimal mock db object for compatibility
  db = {
    select: () => ({ from: () => ({ limit: () => [] }) }),
    insert: () => ({ values: () => Promise.resolve() })
  };
}

export { pool, db };