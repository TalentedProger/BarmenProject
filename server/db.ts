import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// For Replit migration: Allow running without database for in-memory storage mode
let db: any = null;
let pool: any = null;

if (process.env.DATABASE_URL) {
  const isPostgres = process.env.DATABASE_URL.startsWith('postgresql');
  
  if (isPostgres) {
    // PostgreSQL/Neon connection
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    db = drizzleNeon({ client: pool, schema });
    console.log("Connected to PostgreSQL database");
  } else {
    // SQLite connection
    const sqlite = new Database('./dev.db');
    db = drizzleSqlite(sqlite, { schema });
    console.log("Connected to SQLite database");
  }
} else {
  console.log("No DATABASE_URL provided - running in memory storage mode");
  // Create a minimal mock db object for compatibility
  db = {
    select: () => ({ from: () => ({ limit: () => [] }) }),
    insert: () => ({ values: () => Promise.resolve() })
  };
}

export { pool, db };