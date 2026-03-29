import { pgTable, serial, text, integer, timestamp, unique } from "drizzle-orm/pg-core";

export const savedSubjectsTable = pgTable("saved_subjects", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  subjectId: integer("subject_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
}, (table) => [
  unique("saved_subjects_user_subject_unique").on(table.userId, table.subjectId),
]);
