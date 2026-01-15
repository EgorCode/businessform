import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema";

// Use SQLite for local development
const dbUrl = process.env.DATABASE_URL || 'sqlite:./local.db';
const dbPath = dbUrl.startsWith('sqlite:') ? dbUrl.slice(7) : dbUrl;
const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

// Enable foreign keys
sqlite.pragma('foreign_keys = ON');

export default sqlite;
