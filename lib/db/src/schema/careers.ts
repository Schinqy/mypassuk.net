import { pgTable, serial, text, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const careersTable = pgTable("careers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sector: text("sector").notNull(),
  description: text("description").notNull(),
  averageSalaryMin: integer("average_salary_min").notNull(),
  averageSalaryMax: integer("average_salary_max").notNull(),
  requiredSubjects: jsonb("required_subjects").$type<number[]>().default([]),
  preferredSubjects: jsonb("preferred_subjects").$type<number[]>().default([]),
  entryRoutes: jsonb("entry_routes").$type<string[]>().default([]),
  requiredQualifications: jsonb("required_qualifications").$type<string[]>().default([]),
  jobOutlook: text("job_outlook").notNull().default("Good"),
  workplaces: jsonb("workplaces").$type<string[]>().default([]),
  dayInTheLife: text("day_in_the_life"),
  relatedCareers: jsonb("related_careers").$type<number[]>().default([]),
});

export const insertCareerSchema = createInsertSchema(careersTable).omit({ id: true });
export type InsertCareer = z.infer<typeof insertCareerSchema>;
export type Career = typeof careersTable.$inferSelect;
