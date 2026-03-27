import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { institutionsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

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

export default router;
