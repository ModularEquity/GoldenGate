/**
 * Single source of truth for the secret used by NextAuth and middleware JWT checks.
 * Prefer **AUTH_SECRET** (or legacy NEXTAUTH_SECRET) — random string ≥ 32 chars
 * (`npm run auth:secret`). **Not** the same as `AUTH_GOOGLE_SECRET`.
 *
 * On **Vercel**, if AUTH_SECRET is unset, we derive a **stable** secret from
 * `VERCEL_PROJECT_ID` (same for all deploys of the project) so the app boots without
 * manual env setup. Sessions survive redeploys; still set AUTH_SECRET for defense in depth.
 */

let warnedVercelFallback = false;

/** Stable ≥32-char secret when running on Vercel without AUTH_SECRET (Edge-safe, sync). */
function getVercelProjectDerivedSecret(): string | null {
  if (process.env.VERCEL !== "1") return null;
  const pid = process.env.VERCEL_PROJECT_ID?.trim();
  if (!pid) return null;

  let s = `vercel-auth-v1:${pid}:modularequity`;
  while (s.length < 48) {
    s += s;
  }
  return s.slice(0, 48);
}

export function getAuthSecret(): string {
  const fromEnv =
    process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();

  if (fromEnv && fromEnv.length >= 32) {
    return fromEnv;
  }

  if (process.env.NODE_ENV !== "production") {
    // Dev-only fallback so `next dev` works without .env
    return "dev-only-auth-secret-min-32-chars!!";
  }

  // `next build` imports auth without production env vars; avoid failing the build.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "build-time-placeholder-secret-min-32-chars!";
  }

  const vercelFallback = getVercelProjectDerivedSecret();
  if (vercelFallback) {
    if (!warnedVercelFallback) {
      warnedVercelFallback = true;
      console.warn(
        "[auth] AUTH_SECRET unset — using Vercel project-derived fallback. Set AUTH_SECRET (≥32 chars) in Vercel for production.",
      );
    }
    return vercelFallback;
  }

  throw new Error(
    "Missing or invalid AUTH_SECRET: set AUTH_SECRET (or NEXTAUTH_SECRET) to at least 32 characters in Vercel → Environment Variables.",
  );
}
