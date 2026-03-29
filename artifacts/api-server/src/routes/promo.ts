import { Router } from "express";
import { db } from "@workspace/db";
import { promoCodesTable, usersTable, subjectsTable, careersTable, institutionsTable, conversations, savedSubjectsTable } from "@workspace/db/schema";
import { eq, sql, count } from "drizzle-orm";

const router = Router();

// ─── Admin middleware ────────────────────────────────────────────────────────

const ADMIN_EMAIL = "munyaradzi.nyamasoka@gmail.com";

function requireAdmin(req: any, res: any, next: any) {
  if (req.user?.email === ADMIN_EMAIL) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorised." });
}

// ─── Admin: platform stats ───────────────────────────────────────────────────

router.get("/admin/stats", requireAdmin, async (_req, res) => {
  const [
    [userRow],
    [premiumRow],
    [subjectRow],
    [careerRow],
    [instRow],
    [convRow],
    [savedRow],
    codes,
  ] = await Promise.all([
    db.select({ n: count() }).from(usersTable),
    db.select({ n: count() }).from(usersTable).where(eq(usersTable.subscriptionStatus, "active")),
    db.select({ n: count() }).from(subjectsTable),
    db.select({ n: count() }).from(careersTable),
    db.select({ n: count() }).from(institutionsTable),
    db.select({ n: count() }).from(conversations),
    db.select({ n: count() }).from(savedSubjectsTable),
    db.select().from(promoCodesTable),
  ]);

  const totalCodes = codes.length;
  const usedCodes = codes.filter((c: any) => c.isUsed).length;

  return res.json({
    users: { total: Number(userRow.n), premium: Number(premiumRow.n) },
    content: {
      subjects: Number(subjectRow.n),
      careers: Number(careerRow.n),
      institutions: Number(instRow.n),
    },
    activity: {
      aiConversations: Number(convRow.n),
      savedSubjects: Number(savedRow.n),
    },
    promoCodes: { total: totalCodes, used: usedCodes, available: totalCodes - usedCodes },
  });
});

// ─── Admin: list users ────────────────────────────────────────────────────────

router.get("/admin/users", requireAdmin, async (_req, res) => {
  const users = await db
    .select({
      id: usersTable.id,
      firstName: usersTable.firstName,
      lastName: usersTable.lastName,
      email: usersTable.email,
      subscriptionPlan: usersTable.subscriptionPlan,
      subscriptionStatus: usersTable.subscriptionStatus,
      updatedAt: usersTable.updatedAt,
    })
    .from(usersTable)
    .orderBy(sql`${usersTable.updatedAt} DESC NULLS LAST`);

  return res.json({ users });
});

// ─── Public: redeem a code ───────────────────────────────────────────────────

router.post("/promo/redeem", async (req, res) => {
  const { code } = req.body as { code?: string };

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "A promo code is required." });
  }

  const normalized = code.trim().toUpperCase();

  const [promo] = await db
    .select()
    .from(promoCodesTable)
    .where(eq(promoCodesTable.code, normalized));

  if (!promo) {
    return res.status(404).json({ error: "Promo code not found. Check it and try again." });
  }

  if (promo.isUsed) {
    return res.status(409).json({ error: "This promo code has already been used." });
  }

  await db
    .update(promoCodesTable)
    .set({ isUsed: true, usedAt: new Date() })
    .where(eq(promoCodesTable.code, normalized));

  return res.json({ success: true, message: "Premium access unlocked! Enjoy MyPassUK." });
});

// ─── Admin: list all codes ───────────────────────────────────────────────────

router.get("/admin/promo-codes", requireAdmin, async (_req, res) => {
  const codes = await db
    .select()
    .from(promoCodesTable)
    .orderBy(promoCodesTable.createdAt);

  const total = codes.length;
  const used = codes.filter(c => c.isUsed).length;

  return res.json({ codes, stats: { total, used, available: total - used } });
});

// ─── Admin: create new codes ─────────────────────────────────────────────────

router.post("/admin/promo-codes", requireAdmin, async (req, res) => {
  const { codes: rawCodes } = req.body as { codes?: string[] };

  if (!Array.isArray(rawCodes) || rawCodes.length === 0) {
    return res.status(400).json({ error: "Provide an array of code strings." });
  }

  const normalized = rawCodes.map(c => c.trim().toUpperCase()).filter(Boolean);
  const inserted: string[] = [];
  const skipped: string[] = [];

  for (const code of normalized) {
    const result = await db.execute(
      sql`INSERT INTO promo_codes (code, is_used) VALUES (${code}, false) ON CONFLICT (code) DO NOTHING`
    );
    if ((result as any).rowCount > 0) {
      inserted.push(code);
    } else {
      skipped.push(code);
    }
  }

  return res.json({ inserted, skipped });
});

// ─── Admin: revoke / reset a code ────────────────────────────────────────────

router.patch("/admin/promo-codes/:code/reset", requireAdmin, async (req, res) => {
  const code = req.params.code.toUpperCase();

  const [existing] = await db
    .select()
    .from(promoCodesTable)
    .where(eq(promoCodesTable.code, code));

  if (!existing) {
    return res.status(404).json({ error: "Code not found." });
  }

  await db
    .update(promoCodesTable)
    .set({ isUsed: false, usedAt: null })
    .where(eq(promoCodesTable.code, code));

  return res.json({ success: true, code });
});

// ─── Admin: delete a code ─────────────────────────────────────────────────────

router.delete("/admin/promo-codes/:code", requireAdmin, async (req, res) => {
  const code = req.params.code.toUpperCase();
  await db.delete(promoCodesTable).where(eq(promoCodesTable.code, code));
  return res.json({ success: true });
});

export default router;
