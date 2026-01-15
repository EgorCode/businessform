import { defineConfig } from "drizzle-kit";


import dotenv from "dotenv";
dotenv.config();

const dbUrl = process.env.DATABASE_URL || "sqlite:./local.db";
const dbPath = dbUrl.startsWith('sqlite:') ? dbUrl.slice(7) : dbUrl;

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
});
