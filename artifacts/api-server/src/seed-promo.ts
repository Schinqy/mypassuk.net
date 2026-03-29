import { db } from "@workspace/db";
import { promoCodesTable } from "@workspace/db/schema";
import { sql } from "drizzle-orm";

const CODES = [
  "MYPASS-LAUNCH1",
  "MYPASS-LAUNCH2",
  "MYPASS-LAUNCH3",
  "MYPASS-LAUNCH4",
  "MYPASS-LAUNCH5",
  "MYPASS-LAUNCH6",
  "MYPASS-LAUNCH7",
  "MYPASS-LAUNCH8",
  "MYPASS-LAUNCH9",
  "MYPASS-LAUNCH10",
];

async function seed() {
  console.log("Seeding promo codes…");

  for (const code of CODES) {
    await db.execute(
      sql`INSERT INTO promo_codes (code, is_used) VALUES (${code}, false) ON CONFLICT (code) DO NOTHING`
    );
    console.log(`  ✓ ${code}`);
  }

  console.log(`\nAll ${CODES.length} promo codes ready.`);

  const all = await db.select().from(promoCodesTable);
  console.log("\nCurrent codes:");
  all.forEach(c => console.log(`  ${c.code}  used=${c.isUsed}`));

  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
