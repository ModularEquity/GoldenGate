import type { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signSessionToken, verifySessionToken } from "@/lib/session-jwt";

const COOKIE = "gg_session";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};

export type { SessionPayload } from "@/lib/session-jwt";

/**
 * Use in Route Handlers — sets `Set-Cookie` on the response (required for fetch from the browser).
 */
export async function applySessionToResponse(
  response: NextResponse,
  userId: string,
  email: string,
) {
  const token = await signSessionToken(userId, email);
  response.cookies.set(COOKIE, token, cookieOptions);
}

export function clearSessionOnResponse(response: NextResponse) {
  response.cookies.set(COOKIE, "", {
    httpOnly: true,
    path: "/",
    maxAge: 0,
  });
}

/** @deprecated Prefer applySessionToResponse in Route Handlers */
export async function createSessionCookie(userId: string, email: string) {
  const token = await signSessionToken(userId, email);
  const store = await cookies();
  store.set(COOKIE, token, cookieOptions);
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.set(COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
}

export async function getSessionFromCookies() {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export { verifySessionToken };
export const SESSION_COOKIE_NAME = COOKIE;
