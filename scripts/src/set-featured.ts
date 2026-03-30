import { db, sql, eq, institutionsTable, institutionAnalyticsTable, institutionReportsTable } from "@workspace/db";

const FEATURED_NAMES = [
  "University of Edinburgh",
  "University of Manchester",
  "King's College London",
  "University of Oxford",
  "University of Cambridge",
  "City, University of London",
  "Leeds City College",
  "Rolls-Royce Apprenticeships",
  "BAE Systems Apprenticeships",
];

const SAMPLE_ANALYTICS: Record<string, { views: number; applyClicks: number }> = {
  "University of Edinburgh":     { views: 847, applyClicks: 63 },
  "University of Manchester":    { views: 712, applyClicks: 58 },
  "King's College London":       { views: 631, applyClicks: 49 },
  "University of Oxford":        { views: 524, applyClicks: 41 },
  "University of Cambridge":     { views: 498, applyClicks: 38 },
  "City, University of London":  { views: 389, applyClicks: 21 },
  "Leeds City College":          { views: 214, applyClicks: 11 },
  "Rolls-Royce Apprenticeships": { views: 178, applyClicks: 22 },
  "BAE Systems Apprenticeships": { views: 156, applyClicks: 19 },
};

async function main() {
  console.log("Setting featured institutions...");

  for (const name of FEATURED_NAMES) {
    const found = await db
      .select({ id: institutionsTable.id })
      .from(institutionsTable)
      .where(eq(institutionsTable.name, name));

    if (found.length === 0) {
      console.log(`  – Not found: ${name}`);
      continue;
    }

    const id = found[0].id;
    await db.update(institutionsTable).set({ featured: true }).where(eq(institutionsTable.id, id));
    console.log(`  ✓ Marked as featured: ${name} (id=${id})`);

    const [{ count }] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(institutionAnalyticsTable)
      .where(eq(institutionAnalyticsTable.institutionId, id));

    if ((count ?? 0) > 0) {
      console.log(`  – Skipping analytics for ${name} (already has data)`);
      continue;
    }

    const sample = SAMPLE_ANALYTICS[name];
    if (!sample) continue;

    const BATCH = 100;
    const now = Date.now();

    const viewRows = Array.from({ length: sample.views }, () => ({
      institutionId: id,
      eventType: "view" as const,
      createdAt: new Date(now - Math.random() * 30 * 86400000),
    }));
    for (let i = 0; i < viewRows.length; i += BATCH) {
      await db.insert(institutionAnalyticsTable).values(viewRows.slice(i, i + BATCH));
    }

    const clickRows = Array.from({ length: sample.applyClicks }, () => ({
      institutionId: id,
      eventType: "apply_click" as const,
      createdAt: new Date(now - Math.random() * 30 * 86400000),
    }));
    for (let i = 0; i < clickRows.length; i += BATCH) {
      await db.insert(institutionAnalyticsTable).values(clickRows.slice(i, i + BATCH));
    }

    console.log(`  ✓ Analytics: ${name}: ${sample.views} views, ${sample.applyClicks} apply clicks`);
  }

  console.log("\nDone.");
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
