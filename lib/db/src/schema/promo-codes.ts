import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const promoCodesTable = pgTable("promo_codes", {
  code: text("code").primaryKey(),
  isUsed: boolean("is_used").default(false).notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PromoCode = typeof promoCodesTable.$inferSelect;
