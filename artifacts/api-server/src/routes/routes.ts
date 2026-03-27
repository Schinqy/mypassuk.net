import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { routesTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/routes", async (req, res) => {
  try {
    const { afterLevel, type } = req.query as { afterLevel?: string; type?: string };
    let routes = await db.select().from(routesTable);
    if (afterLevel) {
      routes = routes.filter((r) => r.afterLevel === afterLevel);
    }
    if (type) {
      routes = routes.filter((r) => r.type === type);
    }
    res.json(routes);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch routes");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to fetch routes" });
  }
});

export default router;
