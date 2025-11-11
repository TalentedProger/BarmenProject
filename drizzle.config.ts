import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

const isPostgres = process.env.DATABASE_URL.startsWith('postgresql');

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: isPostgres ? "postgresql" : "sqlite",
  dbCredentials: isPostgres ? {
    url: process.env.DATABASE_URL,
  } : {
    url: "./dev.db"
  },
});
