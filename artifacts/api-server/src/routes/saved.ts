import { Router, type IRouter, type Request, type Response } from "express";
import { db, savedSubjectsTable, subjectsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

// GET /api/saved/subjects — list saved subjects for auth user (with full subject data)
router.get("/saved/subjects", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const rows = await db
    .select({
      id: savedSubjectsTable.id,
      subjectId: savedSubjectsTable.subjectId,
      savedAt: savedSubjectsTable.savedAt,
      name: subjectsTable.name,
      level: subjectsTable.level,
      category: subjectsTable.category,
    })
    .from(savedSubjectsTable)
    .leftJoin(subjectsTable, eq(savedSubjectsTable.subjectId, subjectsTable.id))
    .where(eq(savedSubjectsTable.userId, req.user.id))
    .orderBy(savedSubjectsTable.savedAt);

  res.json(rows);
});

// POST /api/saved/subjects — save a subject
router.post("/saved/subjects", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const { subjectId } = req.body as { subjectId: number };
  if (!subjectId) {
    res.status(400).json({ error: "subjectId required" });
    return;
  }

  const [row] = await db
    .insert(savedSubjectsTable)
    .values({ userId: req.user.id, subjectId })
    .onConflictDoNothing()
    .returning();

  res.json({ saved: true, id: row?.id });
});

// DELETE /api/saved/subjects/:subjectId — unsave a subject
router.delete("/saved/subjects/:subjectId", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const subjectId = parseInt(req.params.subjectId as string, 10);
  await db
    .delete(savedSubjectsTable)
    .where(
      and(
        eq(savedSubjectsTable.userId, req.user.id),
        eq(savedSubjectsTable.subjectId, subjectId),
      ),
    );

  res.json({ saved: false });
});

export default router;
