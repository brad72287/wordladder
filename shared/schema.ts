import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Word dictionary model for word validation
export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  word: text("word").notNull().unique(),
  length: integer("length").notNull(),
  difficulty: text("difficulty").notNull(), // 'easy', 'medium', 'hard'
});

// Game statistics model
export const gameStats = pgTable("game_stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  startWord: text("start_word").notNull(),
  endWord: text("end_word").notNull(),
  moves: integer("moves").notNull(),
  time: integer("time").notNull(), // in seconds
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertWordSchema = createInsertSchema(words).pick({
  word: true,
  length: true,
  difficulty: true,
});

export const insertGameStatSchema = createInsertSchema(gameStats).pick({
  userId: true,
  startWord: true,
  endWord: true,
  moves: true,
  time: true,
  completed: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertWord = z.infer<typeof insertWordSchema>;
export type Word = typeof words.$inferSelect;

export type InsertGameStat = z.infer<typeof insertGameStatSchema>;
export type GameStat = typeof gameStats.$inferSelect;

// Schema for word validation requests
export const wordValidationSchema = z.object({
  word: z.string().min(1),
});
