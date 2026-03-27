import { pgTable, serial, text, integer, boolean, real, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const institutionsTable = pgTable("institutions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  region: text("region").notNull(),
  city: text("city").notNull(),
  description: text("description").notNull(),
  websiteUrl: text("website_url"),
  russellGroup: boolean("russell_group").default(false),
  ranking: integer("ranking"),
  entryRequirements: text("entry_requirements"),
  ucasPoints: integer("ucas_points"),
  studentSatisfaction: real("student_satisfaction"),
  notableSubjects: jsonb("notable_subjects").$type<string[]>().default([]),
  facilities: jsonb("facilities").$type<string[]>().default([]),
  bursaries: boolean("bursaries").default(false),
  internationalStudents: boolean("international_students").default(true),
  relatedCareers: jsonb("related_careers").$type<number[]>().default([]),
  annualFees: integer("annual_fees"),
  internationalFees: integer("international_fees"),
  openDayDates: jsonb("open_day_dates").$type<string[]>().default([]),
  applicationDeadline: text("application_deadline"),
  applicationsOpen: text("applications_open"),
  featured: boolean("featured").default(false),
});

export const insertInstitutionSchema = createInsertSchema(institutionsTable).omit({ id: true });
export type InsertInstitution = z.infer<typeof insertInstitutionSchema>;
export type Institution = typeof institutionsTable.$inferSelect;
