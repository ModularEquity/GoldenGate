/**
 * Single source of truth for the secret used by NextAuth and middleware JWT checks.
 * On Vercel, set **AUTH_SECRET** (or legacy NEXTAUTH_SECRET) to a random string ≥ 32 chars.
 */
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

  throw new Error(
    "Missing or invalid AUTH_SECRET: set AUTH_SECRET (or NEXTAUTH_SECRET) to at least 32 characters in Vercel → Environment Variables.",
  );
}
