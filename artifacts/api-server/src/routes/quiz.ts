import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { careersTable, institutionsTable, routesTable } from "@workspace/db/schema";

const router: IRouter = Router();

interface QuizInput {
  gcseSubjects?: Array<{ subjectId: number; grade: string }>;
  aLevelSubjects?: Array<{ subjectId: number; predictedGrade: string }>;
  interests?: string[];
  preferredRegion?: string;
  preferredRouteType?: string;
}

const INTEREST_TO_SECTOR: Record<string, string[]> = {
  science: ["Healthcare", "Science", "Engineering", "Technology"],
  technology: ["Technology", "Engineering"],
  business: ["Business", "Finance"],
  creative: ["Creative Arts"],
  law: ["Law", "Public Services"],
  healthcare: ["Healthcare"],
  education: ["Education"],
  finance: ["Finance", "Business"],
  engineering: ["Engineering", "Technology"],
  environment: ["Science", "Engineering"],
  social: ["Education", "Public Services"],
  maths: ["Finance", "Technology", "Engineering", "Science"],
};

router.post("/quiz/recommend", async (req, res) => {
  try {
    const input: QuizInput = req.body;
    const { gcseSubjects = [], aLevelSubjects = [], interests = [], preferredRegion, preferredRouteType } = input;

    const allSubjectIds = [
      ...gcseSubjects.map((s) => s.subjectId),
      ...aLevelSubjects.map((s) => s.subjectId),
    ];

    const relevantSectors = new Set<string>();
    for (const interest of interests) {
      const sectors = INTEREST_TO_SECTOR[interest.toLowerCase()] || [];
      sectors.forEach((s) => relevantSectors.add(s));
    }

    let allCareers = await db.select().from(careersTable);
    let allInstitutions = await db.select().from(institutionsTable);
    let allRoutes = await db.select().from(routesTable);

    let scoredCareers = allCareers.map((career) => {
      let score = 0;
      if (relevantSectors.has(career.sector)) score += 30;
      const subjectOverlap = allSubjectIds.filter((sid) =>
        (career.requiredSubjects as number[]).includes(sid) ||
        (career.preferredSubjects as number[]).includes(sid)
      ).length;
      score += subjectOverlap * 15;
      if (career.jobOutlook === "Excellent") score += 10;
      else if (career.jobOutlook === "Good") score += 5;
      return { career, score };
    });

    scoredCareers.sort((a, b) => b.score - a.score);
    const recommendedCareers = scoredCareers.slice(0, 5).map((s) => s.career);

    let scoredInstitutions = allInstitutions.map((inst) => {
      let score = 0;
      if (preferredRegion && inst.region === preferredRegion) score += 20;
      if (preferredRouteType === "University" && inst.type === "University") score += 15;
      else if (preferredRouteType === "College" && inst.type === "College") score += 15;
      else if (preferredRouteType === "Apprenticeship" && inst.type === "Apprenticeship Provider") score += 15;
      const careerOverlap = recommendedCareers.filter((c) =>
        (inst.relatedCareers as number[]).includes(c.id)
      ).length;
      score += careerOverlap * 10;
      if (aLevelSubjects.length > 0 && inst.type === "University") score += 10;
      return { inst, score };
    });
    scoredInstitutions.sort((a, b) => b.score - a.score);
    const recommendedInstitutions = scoredInstitutions.slice(0, 6).map((s) => s.inst);

    let scoredRoutes = allRoutes.map((route) => {
      let score = 0;
      if (preferredRouteType && route.type.toLowerCase().includes(preferredRouteType.toLowerCase())) score += 20;
      if (aLevelSubjects.length > 0 && route.afterLevel === "A-Level") score += 10;
      else if (gcseSubjects.length > 0 && aLevelSubjects.length === 0 && route.afterLevel === "GCSE") score += 10;
      return { route, score };
    });
    scoredRoutes.sort((a, b) => b.score - a.score);
    const recommendedRoutes = scoredRoutes.slice(0, 4).map((s) => s.route);

    const topCareer = recommendedCareers[0];
    const personalMessage = topCareer
      ? `Based on your interests and subjects, a career in ${topCareer.title} could be a great match for you! Explore the recommended routes and institutions below to plan your next steps.`
      : `Based on your interests, we've found some great pathways for you. Explore the recommendations below to find the right route for your future.`;

    res.json({
      recommendedCareers,
      recommendedInstitutions,
      recommendedRoutes,
      personalMessage,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to generate recommendations");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to generate recommendations" });
  }
});

export default router;
