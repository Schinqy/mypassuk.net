import { Router, type IRouter } from "express";
import { sendSupportEmail } from "../lib/email.js";

const router: IRouter = Router();

const SUPPORT_SUBJECTS = [
  "Billing & subscription",
  "Account access",
  "AI Study Assistant",
  "Study plans & timetables",
  "Institution listings",
  "Technical issue",
  "Feature request",
  "Other",
];

router.get("/support/subjects", (_req, res) => {
  res.json({ subjects: SUPPORT_SUBJECTS });
});

router.post("/support/contact", async (req, res) => {
  const user = (req as any).user;
  if (!user) {
    return res.status(401).json({ error: "You must be signed in to contact support" });
  }

  const { subject, message } = req.body as { subject?: string; message?: string };

  if (!subject?.trim()) {
    return res.status(400).json({ error: "Please select a subject" });
  }
  if (!message?.trim() || message.trim().length < 20) {
    return res.status(400).json({ error: "Please write at least 20 characters" });
  }
  if (message.trim().length > 2000) {
    return res.status(400).json({ error: "Message must be under 2000 characters" });
  }

  const fromName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "MyPassUK User";
  const planLabel = user.subscriptionStatus === "active" ? (user.subscriptionPlan ?? "Premium") : "Free";

  const result = await sendSupportEmail({
    fromEmail: user.email,
    fromName,
    planLabel,
    subject: subject.trim(),
    message: message.trim(),
  });

  if (!result.sent) {
    return res.status(500).json({ error: result.error ?? "Failed to send message. Please try again." });
  }

  return res.json({ ok: true });
});

export default router;
