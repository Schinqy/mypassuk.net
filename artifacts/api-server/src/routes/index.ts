import { Router, type IRouter } from "express";
import healthRouter from "./health";
import subjectsRouter from "./subjects";
import careersRouter from "./careers";
import institutionsRouter from "./institutions";
import routesRouter from "./routes";
import quizRouter from "./quiz";
import openaiRouter from "./openai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(subjectsRouter);
router.use(careersRouter);
router.use(institutionsRouter);
router.use(routesRouter);
router.use(quizRouter);
router.use(openaiRouter);

export default router;
