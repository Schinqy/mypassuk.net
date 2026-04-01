import { db, sql } from "@workspace/db";
import { execSync } from "child_process";

async function deploySeed() {
  const workspaceRoot = new URL("../../", import.meta.url).pathname;

  const run = (scriptName: string) => {
    console.log(`\n── Running ${scriptName} ──`);
    execSync(`pnpm --filter @workspace/scripts run ${scriptName}`, {
      stdio: "inherit",
      env: process.env,
      cwd: workspaceRoot,
    });
  };

  const runCmd = (cmd: string, label: string) => {
    console.log(`\n── ${label} ──`);
    execSync(cmd, { stdio: "inherit", env: process.env, cwd: workspaceRoot });
  };

  // Always run schema migrations first so all columns/tables exist
  console.log("Pushing database schema...");
  runCmd("pnpm --filter @workspace/db run push-force", "DB schema push");

  // Run Stripe schema migrations (stripe.* tables) — must run outside compiled bundle
  console.log("Running Stripe schema migrations...");
  runCmd(
    `node --input-type=module --eval "import { runMigrations } from 'stripe-replit-sync'; await runMigrations({ databaseUrl: process.env.DATABASE_URL });"`,
    "Stripe migrations"
  );

  console.log("\nChecking if database needs seeding...");
  const result = await db.execute(sql`SELECT COUNT(*)::int AS count FROM subjects`);
  const count = (result.rows[0] as { count: number }).count;

  if (count === 0) {
    console.log("Database is empty. Running all seed scripts...\n");

    run("seed");
    run("update-resources");
    run("expand-data");
    run("update-alerts");
    run("add-apprenticeships");

    console.log("\nAll seed scripts completed successfully!");
  } else {
    console.log(`Database already has ${count} subjects. Skipping full seed.`);
  }

  // Always ensure Scotland-specific subjects exist (idempotent — uses onConflictDoNothing)
  console.log("\nEnsuring Scottish subjects are present...");
  const scotResult = await db.execute(sql`SELECT COUNT(*)::int AS count FROM subjects WHERE level IN ('National 5', 'Higher', 'Advanced Higher')`);
  const scotCount = (scotResult.rows[0] as { count: number }).count;
  if (scotCount === 0) {
    console.log("No Scottish subjects found. Adding them...");
    run("add-scottish-subjects");
  } else {
    console.log(`Found ${scotCount} Scottish subjects. ✓`);
  }

  // Always ensure Welsh-specific subjects exist (idempotent — uses onConflictDoNothing)
  console.log("\nEnsuring Welsh subjects are present...");
  const welshResult = await db.execute(sql`SELECT COUNT(*)::int AS count FROM subjects WHERE level = 'Welsh Bacc'`);
  const welshCount = (welshResult.rows[0] as { count: number }).count;
  if (welshCount === 0) {
    console.log("No Welsh Bacc subjects found. Adding them...");
    run("add-welsh-subjects");
  } else {
    console.log(`Found ${welshCount} Welsh Bacc subjects. ✓`);
  }

  process.exit(0);
}

deploySeed().catch((err) => {
  console.error("Deploy seed failed:", err);
  process.exit(1);
});
