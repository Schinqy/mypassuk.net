import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { institutionsTable, institutionAnalyticsTable, institutionReportsTable } from "@workspace/db/schema";
import { eq, sql, and, desc } from "drizzle-orm";
import { sendAnalyticsReportEmail } from "../lib/email.js";

const router: IRouter = Router();
const ADMIN_EMAIL = "munyaradzi.nyamasoka@gmail.com";

function isAdmin(req: any) {
  return req.user?.email === ADMIN_EMAIL;
}

// ── Public: institution alerts (sorted featured-first) ────────────────────────
router.get("/institutions/alerts", async (req, res) => {
  try {
    const all = await db.select().from(institutionsTable);
    const today = new Date().toISOString().slice(0, 10);
    const sorted = all.sort((a, b) => {
      // Featured first, then by next open day
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
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

// ── Public: list institutions ─────────────────────────────────────────────────
router.get("/institutions", async (req, res) => {
  try {
    const { type, region, russellGroup, careerId } = req.query as {
      type?: string; region?: string; russellGroup?: string; careerId?: string;
    };
    let institutions = await db.select().from(institutionsTable);
    if (type) institutions = institutions.filter(i => i.type === type);
    if (region) institutions = institutions.filter(i => i.region === region);
    if (russellGroup !== undefined) {
      const isRG = russellGroup === "true";
      institutions = institutions.filter(i => i.russellGroup === isRG);
    }
    if (careerId) {
      const cid = parseInt(careerId, 10);
      institutions = institutions.filter(i => (i.relatedCareers as number[]).includes(cid));
    }
    institutions.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    res.json(institutions);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch institutions");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ── Public: single institution ────────────────────────────────────────────────
router.get("/institutions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid institution ID" }); return; }
    const [institution] = await db.select().from(institutionsTable).where(eq(institutionsTable.id, id));
    if (!institution) { res.status(404).json({ error: "Not Found" }); return; }
    res.json(institution);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch institution");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ── Public: track view / apply_click ─────────────────────────────────────────
router.post("/institutions/:id/track", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) { res.status(400).json({ error: "Invalid id" }); return; }
    const { eventType } = req.body as { eventType?: string };
    if (eventType !== "view" && eventType !== "apply_click") {
      res.status(400).json({ error: "eventType must be 'view' or 'apply_click'" }); return;
    }
    await db.insert(institutionAnalyticsTable).values({ institutionId: id, eventType });
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to track institution event");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ── Admin: update contact email/name for an institution ───────────────────────
router.patch("/admin/institutions/:id/contact", async (req: any, res) => {
  try {
    if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }
    const id = parseInt(req.params.id, 10);
    const { contactEmail, contactName } = req.body as { contactEmail?: string; contactName?: string };
    await db.update(institutionsTable)
      .set({ contactEmail: contactEmail ?? null, contactName: contactName ?? null })
      .where(eq(institutionsTable.id, id));
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to update institution contact");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ── Admin: analytics overview ─────────────────────────────────────────────────
router.get("/admin/institution-analytics", async (req: any, res) => {
  try {
    if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }

    const analyticsRows = await db
      .select({
        institutionId: institutionAnalyticsTable.institutionId,
        eventType: institutionAnalyticsTable.eventType,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(institutionAnalyticsTable)
      .groupBy(institutionAnalyticsTable.institutionId, institutionAnalyticsTable.eventType);

    const featured = await db
      .select({
        id: institutionsTable.id,
        name: institutionsTable.name,
        city: institutionsTable.city,
        contactEmail: institutionsTable.contactEmail,
        contactName: institutionsTable.contactName,
      })
      .from(institutionsTable)
      .where(eq(institutionsTable.featured, true));

    // Last report sent per institution
    const lastReports = await db
      .select({
        institutionId: institutionReportsTable.institutionId,
        sentAt: institutionReportsTable.sentAt,
        periodMonth: institutionReportsTable.periodMonth,
        periodYear: institutionReportsTable.periodYear,
      })
      .from(institutionReportsTable)
      .orderBy(desc(institutionReportsTable.sentAt));

    const lastReportMap: Record<number, { sentAt: string; periodMonth: number; periodYear: number }> = {};
    for (const r of lastReports) {
      if (!lastReportMap[r.institutionId]) {
        lastReportMap[r.institutionId] = {
          sentAt: r.sentAt.toISOString(),
          periodMonth: r.periodMonth,
          periodYear: r.periodYear,
        };
      }
    }

    const analyticsMap: Record<number, { views: number; applyClicks: number }> = {};
    for (const row of analyticsRows) {
      if (!analyticsMap[row.institutionId]) analyticsMap[row.institutionId] = { views: 0, applyClicks: 0 };
      if (row.eventType === "view") analyticsMap[row.institutionId].views = row.count;
      if (row.eventType === "apply_click") analyticsMap[row.institutionId].applyClicks = row.count;
    }

    const now = new Date();
    const result = featured.map(inst => ({
      id: inst.id,
      name: inst.name,
      city: inst.city,
      contactEmail: inst.contactEmail,
      contactName: inst.contactName,
      views: analyticsMap[inst.id]?.views ?? 0,
      applyClicks: analyticsMap[inst.id]?.applyClicks ?? 0,
      lastReport: lastReportMap[inst.id] ?? null,
      overdueReport: !lastReportMap[inst.id] || (
        lastReportMap[inst.id].periodMonth !== now.getMonth() + 1 ||
        lastReportMap[inst.id].periodYear !== now.getFullYear()
      ),
    })).sort((a, b) => b.views - a.views);

    res.json({ institutions: result });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch institution analytics");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ── Admin: send monthly report to one institution ─────────────────────────────
router.post("/admin/institutions/:id/send-report", async (req: any, res) => {
  try {
    if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }

    const id = parseInt(req.params.id, 10);
    const { overrideEmail } = req.body as { overrideEmail?: string };

    const [inst] = await db.select().from(institutionsTable).where(eq(institutionsTable.id, id));
    if (!inst) { res.status(404).json({ error: "Institution not found" }); return; }
    if (!inst.featured) { res.status(400).json({ error: "Institution is not featured" }); return; }

    const toEmail = overrideEmail || inst.contactEmail;
    if (!toEmail) {
      res.status(400).json({ error: "No contact email set for this institution. Add one first." });
      return;
    }

    // Aggregate analytics
    const analyticsRows = await db
      .select({
        eventType: institutionAnalyticsTable.eventType,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(institutionAnalyticsTable)
      .where(eq(institutionAnalyticsTable.institutionId, id))
      .groupBy(institutionAnalyticsTable.eventType);

    const allTimeViews = analyticsRows.find(r => r.eventType === "view")?.count ?? 0;
    const allTimeClicks = analyticsRows.find(r => r.eventType === "apply_click")?.count ?? 0;

    // This-month analytics
    const now = new Date();
    const periodMonth = now.getMonth() + 1;
    const periodYear = now.getFullYear();

    const monthRows = await db
      .select({
        eventType: institutionAnalyticsTable.eventType,
        count: sql<number>`cast(count(*) as int)`,
      })
      .from(institutionAnalyticsTable)
      .where(and(
        eq(institutionAnalyticsTable.institutionId, id),
        sql`EXTRACT(MONTH FROM ${institutionAnalyticsTable.createdAt}) = ${periodMonth}`,
        sql`EXTRACT(YEAR FROM ${institutionAnalyticsTable.createdAt}) = ${periodYear}`,
      ))
      .groupBy(institutionAnalyticsTable.eventType);

    const monthViews = monthRows.find(r => r.eventType === "view")?.count ?? 0;
    const monthClicks = monthRows.find(r => r.eventType === "apply_click")?.count ?? 0;

    const result = await sendAnalyticsReportEmail(toEmail, {
      institutionName: inst.name,
      contactName: inst.contactName,
      city: inst.city,
      periodMonth,
      periodYear,
      views: monthViews,
      applyClicks: monthClicks,
      allTimeViews,
      allTimeClicks,
    });

    if (!result.sent) {
      res.status(500).json({ error: result.error ?? "Failed to send email" });
      return;
    }

    // Record the send
    await db.insert(institutionReportsTable).values({
      institutionId: id,
      sentTo: toEmail,
      periodMonth,
      periodYear,
      views: monthViews,
      applyClicks: monthClicks,
    });

    res.json({ ok: true, sentTo: toEmail });
  } catch (err) {
    req.log.error({ err }, "Failed to send institution report");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ── Admin: send reports to ALL featured institutions with a contact email ──────
router.post("/admin/institutions/send-all-reports", async (req: any, res) => {
  try {
    if (!isAdmin(req)) { res.status(403).json({ error: "Forbidden" }); return; }

    const featured = await db.select().from(institutionsTable).where(eq(institutionsTable.featured, true));
    const eligible = featured.filter(i => i.contactEmail);

    if (eligible.length === 0) {
      res.json({ ok: true, sent: 0, skipped: featured.length, results: [] });
      return;
    }

    const now = new Date();
    const periodMonth = now.getMonth() + 1;
    const periodYear = now.getFullYear();

    const results: { name: string; email: string; ok: boolean; error?: string }[] = [];

    for (const inst of eligible) {
      // Analytics aggregation
      const allTimeRows = await db
        .select({ eventType: institutionAnalyticsTable.eventType, count: sql<number>`cast(count(*) as int)` })
        .from(institutionAnalyticsTable)
        .where(eq(institutionAnalyticsTable.institutionId, inst.id))
        .groupBy(institutionAnalyticsTable.eventType);

      const allTimeViews = allTimeRows.find(r => r.eventType === "view")?.count ?? 0;
      const allTimeClicks = allTimeRows.find(r => r.eventType === "apply_click")?.count ?? 0;

      const monthRows = await db
        .select({ eventType: institutionAnalyticsTable.eventType, count: sql<number>`cast(count(*) as int)` })
        .from(institutionAnalyticsTable)
        .where(and(
          eq(institutionAnalyticsTable.institutionId, inst.id),
          sql`EXTRACT(MONTH FROM ${institutionAnalyticsTable.createdAt}) = ${periodMonth}`,
          sql`EXTRACT(YEAR FROM ${institutionAnalyticsTable.createdAt}) = ${periodYear}`,
        ))
        .groupBy(institutionAnalyticsTable.eventType);

      const monthViews = monthRows.find(r => r.eventType === "view")?.count ?? 0;
      const monthClicks = monthRows.find(r => r.eventType === "apply_click")?.count ?? 0;

      const emailResult = await sendAnalyticsReportEmail(inst.contactEmail!, {
        institutionName: inst.name,
        contactName: inst.contactName,
        city: inst.city,
        periodMonth,
        periodYear,
        views: monthViews,
        applyClicks: monthClicks,
        allTimeViews,
        allTimeClicks,
      });

      if (emailResult.sent) {
        await db.insert(institutionReportsTable).values({
          institutionId: inst.id,
          sentTo: inst.contactEmail!,
          periodMonth,
          periodYear,
          views: monthViews,
          applyClicks: monthClicks,
        });
      }

      results.push({ name: inst.name, email: inst.contactEmail!, ok: emailResult.sent, error: emailResult.error });
    }

    const sent = results.filter(r => r.ok).length;
    res.json({ ok: true, sent, skipped: featured.length - eligible.length, results });
  } catch (err) {
    req.log.error({ err }, "Failed to send all reports");
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
