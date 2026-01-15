import dotenv from "dotenv";
dotenv.config();

import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";
import path from "path";

// Use SQLite for local development
const dbUrl = process.env.DATABASE_URL || 'sqlite:./local.db';
const dbPath = dbUrl.startsWith('sqlite:') ? dbUrl.slice(7) : dbUrl;
console.log(`[DB] Opening database at: ${dbPath} (resolved: ${path.resolve(dbPath)})`);
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

export default sqlite;
