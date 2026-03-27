import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { subjectsTable } from "@workspace/db/schema";
import { eq, ilike, or } from "drizzle-orm";

const router: IRouter = Router();

router.get("/subjects", async (req, res) => {
  try {
    const { level, category } = req.query as { level?: string; category?: string };
    let query = db.select().from(subjectsTable).$dynamic();
    const conditions: ReturnType<typeof eq>[] = [];
    if (level && level !== "Both") {
      conditions.push(eq(subjectsTable.level, level));
    }
    if (category) {
      conditions.push(eq(subjectsTable.category, category));
    }
    const subjects = conditions.length
      ? await db.select().from(subjectsTable).where(conditions.length === 1 ? conditions[0] : or(...conditions))
      : await db.select().from(subjectsTable);
    res.json(subjects);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch subjects");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch subjects" });
  }
});

router.get("/subjects/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Bad Request", message: "Invalid subject ID" });
      return;
    }
    const [subject] = await db.select().from(subjectsTable).where(eq(subjectsTable.id, id));
    if (!subject) {
      res.status(404).json({ error: "Not Found", message: "Subject not found" });
      return;
    }
    res.json(subject);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch subject");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch subject" });
  }
});

export default router;
