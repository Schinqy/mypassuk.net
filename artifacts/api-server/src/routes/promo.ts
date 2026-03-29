import { Router } from "express";
import { db } from "@workspace/db";
import { promoCodesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router = Router();

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

export default router;
