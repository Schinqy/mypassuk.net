import { Router, type IRouter, type Request, type Response } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  clearSession,
  getSessionId,
  createSession,
  SESSION_COOKIE,
  SESSION_TTL,
  type AuthUser,
} from "../lib/auth";

const router: IRouter = Router();

const ADMIN_EMAIL = "munyaradzi.nyamasoka@gmail.com";

function setSessionCookie(res: Response, sid: string) {
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

function toAuthUser(user: typeof usersTable.$inferSelect): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    profileImageUrl: user.profileImageUrl,
  };
}

// GET /api/auth/user — return current session user
router.get("/auth/user", (req: Request, res: Response) => {
  res.json({ user: req.isAuthenticated() ? req.user : null });
});

// POST /api/auth/register
router.post("/auth/register", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }
  if (typeof password !== "string" || password.length < 8) {
    res.status(400).json({ error: "Password must be at least 8 characters." });
    return;
  }

  const normalised = String(email).toLowerCase().trim();

  const [existing] = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, normalised))
    .limit(1);

  if (existing) {
    res.status(409).json({ error: "An account with this email already exists." });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const id = crypto.randomUUID();

  const [user] = await db
    .insert(usersTable)
    .values({
      id,
      email: normalised,
      passwordHash,
      firstName: firstName ? String(firstName).trim() : null,
      lastName: lastName ? String(lastName).trim() : null,
      updatedAt: new Date(),
    })
    .returning();

  const authUser = toAuthUser(user);
  const sid = await createSession({ user: authUser });
  setSessionCookie(res, sid);
  res.status(201).json({ user: authUser });
});

// POST /api/auth/login
router.post("/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  const normalised = String(email).toLowerCase().trim();

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, normalised))
    .limit(1);

  if (!user || !user.passwordHash) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const valid = await bcrypt.compare(String(password), user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Invalid email or password." });
    return;
  }

  const authUser = toAuthUser(user);
  const sid = await createSession({ user: authUser });
  setSessionCookie(res, sid);
  res.json({ user: authUser });
});

// POST /api/auth/logout
router.post("/auth/logout", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  if (sid) await clearSession(res, sid);
  res.json({ ok: true });
});

// GET /api/logout — backward-compat redirect
router.get("/logout", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  if (sid) await clearSession(res, sid);
  res.redirect("/");
});

export { ADMIN_EMAIL };
export default router;
