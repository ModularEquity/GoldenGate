import { SignJWT, jwtVerify } from "jose";

export type SessionPayload = {
  sub: string;
  email: string;
};

/**
 * HS256 key (32+ bytes). Set AUTH_SECRET in production.
 * Fallback uses VERCEL_PROJECT_ID (Edge-safe — no Node crypto) if unset.
 */
export function getJwtSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET?.trim();
  if (secret && secret.length >= 32) {
    return new TextEncoder().encode(secret);
  }
  if (process.env.NODE_ENV === "development") {
    return new TextEncoder().encode(
      "dev-only-auth-secret-change-me-32chars!!",
    );
  }
  const fallback = `gg-jwt-${process.env.VERCEL_PROJECT_ID ?? "goldengate"}`;
  const padded = fallback.length >= 32 ? fallback.slice(0, 32) : fallback.padEnd(32, "0");
  return new TextEncoder().encode(padded);
}

export async function signSessionToken(
  userId: string,
  email: string,
): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    const sub = payload.sub;
    const email = payload.email;
    if (typeof sub !== "string" || typeof email !== "string") return null;
    return { sub, email };
  } catch {
    return null;
  }
}
