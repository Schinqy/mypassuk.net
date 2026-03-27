import { pgTable, serial, text, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const subjectsTable = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: text("level").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  examBoards: jsonb("exam_boards").$type<string[]>().default([]),
  studyTips: jsonb("study_tips").$type<string[]>().default([]),
  keyTopics: jsonb("key_topics").$type<string[]>().default([]),
  assessmentStructure: text("assessment_structure"),
  usefulResources: jsonb("useful_resources").$type<{ name: string; url?: string; type: string }[]>().default([]),
  relatedCareers: jsonb("related_careers").$type<number[]>().default([]),
});

export const insertSubjectSchema = createInsertSchema(subjectsTable).omit({ id: true });
export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjectsTable.$inferSelect;
