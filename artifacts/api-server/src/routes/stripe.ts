import { Router, type IRouter } from "express";
import { storage } from "../storage";
import { stripeService } from "../stripeService";

const router: IRouter = Router();

router.get("/stripe/config", async (_req, res) => {
  try {
    const publishableKey = await stripeService.getPublishableKey();
    res.json({ publishableKey });
  } catch (err) {
    console.error("Failed to get Stripe config:", err);
    res.status(500).json({ error: "Failed to get Stripe config" });
  }
});

router.post("/stripe/checkout", async (req: any, res) => {
  try {
    const { priceId, userId, email } = req.body as {
      priceId: string;
      userId: string;
      email?: string;
    };

    if (!priceId || !userId) {
      res.status(400).json({ error: "priceId and userId are required" });
      return;
    }

    await storage.upsertUser(userId);
    let user = await storage.getUser(userId);

    let customerId = user?.stripeCustomerId;
    if (!customerId) {
      const customer = await stripeService.createCustomer(userId, email);
      await storage.updateUserStripeInfo(userId, { stripeCustomerId: customer.id });
      customerId = customer.id;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const session = await stripeService.createCheckoutSession(customerId, priceId, userId, baseUrl);

    res.json({ url: session.url });
  } catch (err: any) {
    console.error("Checkout error:", err.message);
    res.status(500).json({ error: "Failed to create checkout session" });
  }
});

router.get("/stripe/subscription/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await storage.getUser(userId);

    if (!user?.stripeCustomerId) {
      res.json({ isPremium: false, subscription: null });
      return;
    }

    const subscription = await storage.getActiveSubscriptionForCustomer(user.stripeCustomerId);
    res.json({
      isPremium: !!subscription,
      subscription: subscription || null,
    });
  } catch (err: any) {
    console.error("Subscription check error:", err.message);
    res.json({ isPremium: false, subscription: null });
  }
});

router.post("/stripe/portal", async (req: any, res) => {
  try {
    const { userId } = req.body as { userId: string };
    const user = await storage.getUser(userId);

    if (!user?.stripeCustomerId) {
      res.status(404).json({ error: "No subscription found" });
      return;
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const session = await stripeService.createPortalSession(user.stripeCustomerId, `${baseUrl}/pricing`);
    res.json({ url: session.url });
  } catch (err: any) {
    console.error("Portal error:", err.message);
    res.status(500).json({ error: "Failed to create portal session" });
  }
});

export default router;
