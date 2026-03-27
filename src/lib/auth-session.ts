import { cookies } from "next/headers";
import { signSessionToken, verifySessionToken } from "@/lib/session-jwt";

const COOKIE = "gg_session";

export type { SessionPayload } from "@/lib/session-jwt";

export async function createSessionCookie(userId: string, email: string) {
  const token = await signSessionToken(userId, email);

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
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
