import { db, sql } from "@workspace/db";
import { execSync } from "child_process";

async function deploySeed() {
  console.log("Checking if database needs seeding...");

  const result = await db.execute(sql`SELECT COUNT(*)::int AS count FROM subjects`);
  const count = (result.rows[0] as { count: number }).count;

  if (count === 0) {
    console.log("Database is empty. Running all seed scripts...\n");

    const workspaceRoot = new URL("../../", import.meta.url).pathname;

    const run = (scriptName: string) => {
      console.log(`\n── Running ${scriptName} ──`);
      execSync(`pnpm --filter @workspace/scripts run ${scriptName}`, {
        stdio: "inherit",
        env: process.env,
        cwd: workspaceRoot,
      });
    };

    run("seed");
    run("update-resources");
    run("expand-data");
    run("update-alerts");

    console.log("\nAll seed scripts completed successfully!");
  } else {
    console.log(`Database already has ${count} subjects. Skipping seed.`);
  }

  process.exit(0);
}

deploySeed().catch((err) => {
  console.error("Deploy seed failed:", err);
  process.exit(1);
});
