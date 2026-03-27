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

// Maps keywords found inside interest strings → relevant career sectors
// Frontend sends strings like "Technology & Coding", "Healthcare & Medicine" etc.
const INTEREST_KEYWORD_MAP: Array<{ keywords: string[]; sectors: string[] }> = [
  { keywords: ["technology", "coding", "digital", "computing", "data"], sectors: ["Technology", "Engineering"] },
  { keywords: ["healthcare", "medicine", "medical", "health", "nursing"], sectors: ["Healthcare"] },
  { keywords: ["creative", "arts", "art", "design", "media", "film", "music"], sectors: ["Creative Arts"] },
  { keywords: ["business", "finance", "financial", "economics", "accounting"], sectors: ["Business", "Finance"] },
  { keywords: ["engineering", "math", "maths", "physics", "stem"], sectors: ["Engineering", "Technology", "Science"] },
  { keywords: ["social", "sociology", "welfare", "community", "public"], sectors: ["Education", "Public Services"] },
  { keywords: ["law", "order", "legal", "justice", "crime"], sectors: ["Law", "Public Services"] },
  { keywords: ["environment", "nature", "ecology", "climate", "geography"], sectors: ["Science", "Engineering"] },
  { keywords: ["education", "teaching", "school", "learning"], sectors: ["Education"] },
  { keywords: ["science", "research", "biology", "chemistry"], sectors: ["Science", "Healthcare"] },
];

function interestsToSectors(interests: string[]): Set<string> {
  const sectors = new Set<string>();
  for (const interest of interests) {
    const lower = interest.toLowerCase();
    for (const mapping of INTEREST_KEYWORD_MAP) {
      if (mapping.keywords.some((kw) => lower.includes(kw))) {
        mapping.sectors.forEach((s) => sectors.add(s));
      }
    }
  }
  return sectors;
}

router.post("/quiz/recommend", async (req, res) => {
  try {
    const input: QuizInput = req.body;
    const {
      gcseSubjects = [],
      aLevelSubjects = [],
      interests = [],
      preferredRegion,
      preferredRouteType,
    } = input;

    const allSubjectIds = [
      ...gcseSubjects.map((s) => s.subjectId),
      ...aLevelSubjects.map((s) => s.subjectId),
    ];

    const relevantSectors = interestsToSectors(interests);

    const allCareers = await db.select().from(careersTable);
    const allInstitutions = await db.select().from(institutionsTable);
    const allRoutes = await db.select().from(routesTable);

    // ── Score careers ─────────────────────────────────────────────────────────
    const MAX_CAREER_SCORE = 60; // theoretical max: 30 (sector) + 15*2 (2 subjects) + 10 (outlook)
    let scoredCareers = allCareers.map((career) => {
      let score = 0;
      if (relevantSectors.has(career.sector)) score += 30;
      const subjectOverlap = allSubjectIds.filter(
        (sid) =>
          (career.requiredSubjects as number[]).includes(sid) ||
          (career.preferredSubjects as number[]).includes(sid),
      ).length;
      score += Math.min(subjectOverlap, 2) * 15;
      if (career.jobOutlook === "Excellent") score += 10;
      else if (career.jobOutlook === "Good") score += 5;
      return { career, score };
    });

    scoredCareers.sort((a, b) => b.score - a.score);
    const recommendedCareers = scoredCareers.slice(0, 5).map((s) => s.career);
    const topCareerScore = scoredCareers[0]?.score ?? 0;

    // ── Score institutions ────────────────────────────────────────────────────
    const preferredRouteTypeLower = (preferredRouteType ?? "").toLowerCase();
    let scoredInstitutions = allInstitutions.map((inst) => {
      let score = 0;
      if (preferredRegion && inst.region === preferredRegion) score += 20;
      if (preferredRouteTypeLower === "university" && inst.type === "University") score += 15;
      else if (preferredRouteTypeLower === "college" && inst.type === "College") score += 15;
      else if (
        (preferredRouteTypeLower === "apprenticeship" || preferredRouteTypeLower === "vocational") &&
        inst.type === "Apprenticeship Provider"
      ) score += 15;
      const careerOverlap = recommendedCareers.filter((c) =>
        (inst.relatedCareers as number[]).includes(c.id),
      ).length;
      score += careerOverlap * 10;
      if (aLevelSubjects.length > 0 && inst.type === "University") score += 5;
      if (inst.ranking && inst.ranking <= 20) score += 3;
      return { inst, score };
    });
    scoredInstitutions.sort((a, b) => b.score - a.score);
    const recommendedInstitutions = scoredInstitutions.slice(0, 6).map((s) => s.inst);

    // ── Score routes ──────────────────────────────────────────────────────────
    let scoredRoutes = allRoutes.map((route) => {
      let score = 0;
      const routeTypeLower = route.type.toLowerCase();
      if (preferredRouteTypeLower && routeTypeLower.includes(preferredRouteTypeLower)) score += 20;
      if (aLevelSubjects.length > 0 && route.afterLevel === "A-Level") score += 10;
      else if (gcseSubjects.length > 0 && aLevelSubjects.length === 0 && route.afterLevel === "GCSE") score += 10;
      return { route, score };
    });
    scoredRoutes.sort((a, b) => b.score - a.score);
    const recommendedRoutes = scoredRoutes.slice(0, 4).map((s) => s.route);

    // ── Build personalised message ─────────────────────────────────────────────
    const topCareer = recommendedCareers[0];
    const topInstitution = recommendedInstitutions[0];
    let personalMessage = "";
    if (topCareer && topInstitution) {
      personalMessage = `Based on your interests and subjects, a career in ${topCareer.title} could be a great match for you! Institutions like ${topInstitution.name} can help you get there. Explore the recommended routes and institutions below to plan your next steps.`;
    } else if (topCareer) {
      personalMessage = `Based on your interests and subjects, a career in ${topCareer.title} looks like a great fit. Explore the recommendations below to discover your ideal route and institutions.`;
    } else {
      personalMessage = `Based on your interests, we've found some great pathways for you. Explore the recommendations below to find the right route for your future.`;
    }

    // ── Compute match score (0–100) ───────────────────────────────────────────
    const rawMatchScore = Math.round((topCareerScore / MAX_CAREER_SCORE) * 100);
    const matchScore = Math.min(97, Math.max(45, rawMatchScore));

    res.json({
      recommendedCareers,
      recommendedInstitutions,
      recommendedRoutes,
      personalMessage,
      matchScore,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to generate recommendations");
    res.status(500).json({ error: "Internal Server Error", message: "Failed to generate recommendations" });
  }
});

export default router;
