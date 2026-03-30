import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { institutionsTable, institutionAnalyticsTable } from "@workspace/db/schema";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/institutions/alerts", async (req, res) => {
  try {
    const all = await db.select().from(institutionsTable);
    const today = new Date().toISOString().slice(0, 10);
    const sorted = all.sort((a, b) => {
      const nextA = (a.openDayDates as string[]).find(d => d >= today) ?? "9999-12-31";
      const nextB = (b.openDayDates as string[]).find(d => d >= today) ?? "9999-12-31";
      return nextA.localeCompare(nextB);
    });
    res.json(sorted);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch institution alerts");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/institutions", async (req, res) => {
  try {
    const { type, region, russellGroup, careerId } = req.query as {
      type?: string;
      region?: string;
      russellGroup?: string;
      careerId?: string;
    };
    let institutions = await db.select().from(institutionsTable);
    if (type) {
      institutions = institutions.filter((i) => i.type === type);
    }
    if (region) {
      institutions = institutions.filter((i) => i.region === region);
    }
    if (russellGroup !== undefined) {
      const isRG = russellGroup === "true";
      institutions = institutions.filter((i) => i.russellGroup === isRG);
    }
    if (careerId) {
      const cid = parseInt(careerId, 10);
      institutions = institutions.filter((i) =>
        (i.relatedCareers as number[]).includes(cid)
      );
    }
    institutions.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    res.json(institutions);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch institutions");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch institutions" });
  }
});

router.get("/institutions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Bad Request", message: "Invalid institution ID" });
      return;
    }
    const [institution] = await db.select().from(institutionsTable).where(eq(institutionsTable.id, id));
    if (!institution) {
      res.status(404).json({ error: "Not Found", message: "Institution not found" });
      return;
    }
    res.json(institution);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch institution");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch institution" });
  }
});

router.post("/institutions/:id/track", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const { eventType } = req.body as { eventType?: string };
    if (eventType !== "view" && eventType !== "apply_click") {
      res.status(400).json({ error: "eventType must be 'view' or 'apply_click'" });
      return;
    }
    await db.insert(institutionAnalyticsTable).values({ institutionId: id, eventType });
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to track institution event");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/admin/institution-analytics", async (req: any, res) => {
  try {
    if (!req.user || req.user.email !== "munyaradzi.nyamasoka@gmail.com") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const rows = await db
      .select({
        institutionId: institutionAnalyticsTable.institutionId,
        eventType: institutionAnalyticsTable.eventType,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(institutionAnalyticsTable)
      .groupBy(institutionAnalyticsTable.institutionId, institutionAnalyticsTable.eventType);

    const featured = await db
      .select({ id: institutionsTable.id, name: institutionsTable.name })
      .from(institutionsTable)
      .where(eq(institutionsTable.featured, true));

    const analyticsMap: Record<number, { views: number; applyClicks: number }> = {};
    for (const row of rows) {
      if (!analyticsMap[row.institutionId]) {
        analyticsMap[row.institutionId] = { views: 0, applyClicks: 0 };
      }
      if (row.eventType === "view") analyticsMap[row.institutionId].views = row.count;
      if (row.eventType === "apply_click") analyticsMap[row.institutionId].applyClicks = row.count;
    }

    const result = featured.map(inst => ({
      id: inst.id,
      name: inst.name,
      views: analyticsMap[inst.id]?.views ?? 0,
      applyClicks: analyticsMap[inst.id]?.applyClicks ?? 0,
    })).sort((a, b) => b.views - a.views);

    res.json({ institutions: result });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch institution analytics");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
