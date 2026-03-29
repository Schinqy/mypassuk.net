import * as oidc from "openid-client";
import { Router, type IRouter, type Request, type Response } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  clearSession,
  getOidcConfig,
  getSessionId,
  createSession,
  deleteSession,
  SESSION_COOKIE,
  SESSION_TTL,
  ISSUER_URL,
  type SessionData,
  type AuthUser,
} from "../lib/auth";

const OIDC_COOKIE_TTL = 10 * 60 * 1000;
const router: IRouter = Router();

function getOrigin(req: Request): string {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers["host"] || "localhost";
  return `${proto}://${host}`;
}

function setSessionCookie(res: Response, sid: string) {
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL,
  });
}

function setOidcCookie(res: Response, name: string, value: string) {
  res.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: OIDC_COOKIE_TTL,
  });
}

function getSafeReturnTo(value: unknown): string {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }
  return value;
}

async function upsertUser(claims: Record<string, unknown>): Promise<AuthUser> {
  const userData = {
    id: claims.sub as string,
    email: (claims.email as string) || null,
    firstName: (claims.first_name as string) || null,
    lastName: (claims.last_name as string) || null,
    profileImageUrl: ((claims.profile_image_url || claims.picture) as string) || null,
    updatedAt: new Date(),
  };

  const [user] = await db
    .insert(usersTable)
    .values(userData)
    .onConflictDoUpdate({
      target: usersTable.id,
      set: userData,
    })
    .returning();

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

// GET /api/login — start OIDC login flow
router.get("/login", async (req: Request, res: Response) => {
  const config = await getOidcConfig();
  const callbackUrl = `${getOrigin(req)}/api/callback`;
  const returnTo = getSafeReturnTo(req.query.returnTo);

  const state = oidc.randomState();
  const nonce = oidc.randomNonce();
  const codeVerifier = oidc.randomPKCECodeVerifier();
  const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);

  const redirectTo = oidc.buildAuthorizationUrl(config, {
    redirect_uri: callbackUrl,
    scope: "openid email profile offline_access",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    prompt: "login consent",
    state,
    nonce,
  });

  setOidcCookie(res, "code_verifier", codeVerifier);
  setOidcCookie(res, "nonce", nonce);
  setOidcCookie(res, "state", state);
  setOidcCookie(res, "return_to", returnTo);

  res.redirect(redirectTo.href);
});

// GET /api/callback — OIDC callback
router.get("/callback", async (req: Request, res: Response) => {
  const config = await getOidcConfig();
  const callbackUrl = `${getOrigin(req)}/api/callback`;

  const codeVerifier = req.cookies?.code_verifier;
  const nonce = req.cookies?.nonce;
  const state = req.cookies?.state;
  const returnTo = getSafeReturnTo(req.cookies?.return_to);

  ["code_verifier", "nonce", "state", "return_to"].forEach((name) =>
    res.clearCookie(name, { path: "/" }),
  );

  try {
    const tokens = await oidc.authorizationCodeGrant(
      config,
      new URL(`${callbackUrl}?${new URLSearchParams(req.query as Record<string, string>)}`),
      {
        pkceCodeVerifier: codeVerifier,
        expectedNonce: nonce ?? undefined,
        expectedState: state,
        idTokenExpected: true,
      },
    );

    const claims = tokens.claims();
    if (!claims) {
      res.status(401).json({ error: "No claims in ID token" });
      return;
    }

    const authUser = await upsertUser(claims as unknown as Record<string, unknown>);
    const now = Math.floor(Date.now() / 1000);
    const sessionData: SessionData = {
      user: authUser,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expiresIn() ? now + tokens.expiresIn()! : (claims.exp as number),
    };

    const sid = await createSession(sessionData);
    setSessionCookie(res, sid);
    res.redirect(returnTo);
  } catch (err) {
    console.error("OIDC callback error:", err);
    res.redirect("/?auth_error=1");
  }
});

// GET /api/logout
router.get("/logout", async (req: Request, res: Response) => {
  const sid = getSessionId(req);
  if (sid) await clearSession(res, sid);

  try {
    const config = await getOidcConfig();
    const endSessionUrl = oidc.buildEndSessionUrl(config, {
      post_logout_redirect_uri: `${getOrigin(req)}/`,
    });
    res.redirect(endSessionUrl.href);
  } catch {
    res.redirect("/");
  }
});

export default router;
