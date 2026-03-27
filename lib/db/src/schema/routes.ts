import { pgTable, serial, text, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const routesTable = pgTable("routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  afterLevel: text("after_level").notNull(),
  duration: text("duration").notNull(),
  description: text("description").notNull(),
  pros: jsonb("pros").$type<string[]>().default([]),
  cons: jsonb("cons").$type<string[]>().default([]),
  entryRequirements: text("entry_requirements"),
  potentialEarnings: text("potential_earnings"),
  examples: jsonb("examples").$type<string[]>().default([]),
});

export const insertRouteSchema = createInsertSchema(routesTable).omit({ id: true });
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Route = typeof routesTable.$inferSelect;
