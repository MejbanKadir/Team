import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["admin", "user"] }).notNull().default("user"),
  avatar: text("avatar"),
  points: integer("points").notNull().default(0),
});

// Project schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category", {
    enum: ["Web Dev", "Hacking", "Automation", "Robotics", "App Dev", "Reverse Engineering", "AI/ML"]
  }).notNull(),
  status: text("status", { enum: ["active", "completed"] }).notNull().default("active"),
  rewardPoints: integer("reward_points").notNull(),
  teamMembers: integer("team_members").array().notNull().default([]),
  teamLeaderId: integer("team_leader_id").notNull(),
  progress: integer("progress").notNull().default(0),
  tasks: jsonb("tasks").notNull().default([]),
  createdAt: text("created_at").notNull(),
});

// Validation schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  avatar: true,
  role: true,
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  category: true,
  rewardPoints: true,
  teamMembers: true,
  teamLeaderId: true,
  tasks: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;