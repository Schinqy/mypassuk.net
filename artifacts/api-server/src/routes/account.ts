import { Router, type IRouter, type Request, type Response } from "express";
import { storage } from "../storage";

const router: IRouter = Router();

// GET /api/account — full account info for authenticated user
router.get("/account", async (req: Request, res: Response) => {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const userId = req.user.id;
  const user = await storage.getUser(userId);

  let subscription = null;
  let isPremium = false;
  let planLabel = "Free";

  if (user?.stripeCustomerId) {
    try {
      subscription = await storage.getActiveSubscriptionForCustomer(user.stripeCustomerId);
      isPremium = !!subscription;
      if (subscription) {
        const amount = (subscription as any).items?.data?.[0]?.price?.unit_amount;
        planLabel = amount >= 9900 ? "Institution" : "Student Premium";
      }
    } catch (_) {}
  }

  res.json({
    user: {
      id: userId,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      profileImageUrl: req.user.profileImageUrl,
    },
    subscription: {
      isPremium,
      planLabel,
      status: (subscription as any)?.status ?? "free",
      currentPeriodEnd: (subscription as any)?.current_period_end
        ? new Date((subscription as any).current_period_end * 1000).toISOString()
        : null,
      cancelAtPeriodEnd: (subscription as any)?.cancel_at_period_end ?? false,
    },
  });
});

export default router;
