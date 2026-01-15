import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().default(sql`(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  created_at: integer("created_at").notNull().default(sql`(unixepoch())`),
});

export const userSessions = sqliteTable("user_sessions", {
  id: text("id").primaryKey(),
  user_id: text("user_id").notNull().references(() => users.id),
  token: text("token").notNull(),
  expires_at: integer("expires_at").notNull(),
});

// News tables
export const newsCategories = sqliteTable("news_categories", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
});

export const news = sqliteTable("news", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  imageUrl: text("image_url"),
  publishedAt: integer("published_at").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  categoryId: integer("category_id").references(() => newsCategories.id),
  tags: text("tags"), // JSON string array
  businessForms: text("business_forms"), // JSON string array: ["НПД", "ИП", "ООО"]
  priority: integer("priority").default(0), // Higher number = higher priority
});

// Telegram integration tables
export const telegramChannels = sqliteTable("telegram_channels", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  telegram_id: text("telegram_id").notNull().unique(),
  title: text("title").notNull(),
  is_active: integer("is_active", { mode: "boolean" }).default(true),
  created_at: integer("created_at").notNull().default(sql`(unixepoch())`),
  webhook_url: text("webhook_url"),
  last_sync_at: integer("last_sync_at"),
});

export const telegramPosts = sqliteTable("telegram_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  channel_id: integer("channel_id").references(() => telegramChannels.id),
  post_id: text("post_id").notNull(),
  content: text("content").notNull(),
  media_urls: text("media_urls"), // JSON string array
  published_at: integer("published_at").notNull(),
  status: text("status").notNull().default("pending"),
  processed_at: integer("processed_at"),
});

// Schemas for users
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertNewsCategorySchema = createInsertSchema(newsCategories).pick({
  name: true,
  slug: true,
});

export const insertNewsSchema = createInsertSchema(news).pick({
  title: true,
  content: true,
  summary: true,
  imageUrl: true,
  publishedAt: true,
  isActive: true,
  categoryId: true,
  tags: true,
  businessForms: true,
  priority: true,
});

export const newsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
  category: z.string().optional(),
  businessForm: z.enum(["НПД", "ИП", "ООО"]).optional(),
  search: z.string().optional(),
});

// Calculation schemas
export const npdCalculationSchema = z.object({
  monthlyIncome: z.number().min(0),
});

export const usnCalculationSchema = z.object({
  yearlyIncome: z.number().min(0),
  yearlyExpenses: z.number().min(0),
});

export const stressTestSchema = z.object({
  monthlyRevenue: z.number().min(0),
  monthlyExpenses: z.number().min(0),
  employees: z.number().min(0),
  partners: z.number().min(1),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type NewsCategory = typeof newsCategories.$inferSelect;
export type InsertNewsCategory = z.infer<typeof insertNewsCategorySchema>;

export type News = typeof news.$inferSelect;
export type InsertNews = z.infer<typeof insertNewsSchema>;
export type NewsQuery = z.infer<typeof newsQuerySchema>;

export type NPDCalculation = z.infer<typeof npdCalculationSchema>;
export type USNCalculation = z.infer<typeof usnCalculationSchema>;
export type StressTest = z.infer<typeof stressTestSchema>;

export type TelegramChannel = typeof telegramChannels.$inferSelect;
export type TelegramPost = typeof telegramPosts.$inferSelect;
