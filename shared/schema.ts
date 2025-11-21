import { sql } from "drizzle-orm";
import { pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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

export type NPDCalculation = z.infer<typeof npdCalculationSchema>;
export type USNCalculation = z.infer<typeof usnCalculationSchema>;
export type StressTest = z.infer<typeof stressTestSchema>;
