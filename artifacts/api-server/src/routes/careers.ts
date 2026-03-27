import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { careersTable } from "@workspace/db/schema";
import { eq, gte, or } from "drizzle-orm";

const router: IRouter = Router();

router.get("/careers", async (req, res) => {
  try {
    const { sector, subjectId, minSalary } = req.query as {
      sector?: string;
      subjectId?: string;
      minSalary?: string;
    };
    let careers = await db.select().from(careersTable);
    if (sector) {
      careers = careers.filter((c) => c.sector === sector);
    }
    if (subjectId) {
      const sid = parseInt(subjectId, 10);
      careers = careers.filter(
        (c) =>
          (c.requiredSubjects as number[]).includes(sid) ||
          (c.preferredSubjects as number[]).includes(sid)
      );
    }
    if (minSalary) {
      const min = parseInt(minSalary, 10);
      careers = careers.filter((c) => c.averageSalaryMax >= min);
    }
    res.json(careers);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch careers");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch careers" });
  }
});

router.get("/careers/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Bad Request", message: "Invalid career ID" });
      return;
    }
    const [career] = await db.select().from(careersTable).where(eq(careersTable.id, id));
    if (!career) {
      res.status(404).json({ error: "Not Found", message: "Career not found" });
      return;
    }
    res.json(career);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch career");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch career" });
  }
});

export default router;
