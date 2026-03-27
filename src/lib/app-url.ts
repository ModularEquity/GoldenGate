/**
 * Canonical public site URL for share links, emails, redirects.
 * Prefer NEXT_PUBLIC_APP_URL in production (e.g. https://modularequity.com).
 */
export function getPublicAppUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    process.env.APP_URL?.trim() ||
    process.env.AUTH_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  const v = process.env.VERCEL_URL?.trim();
  if (v) {
    return v.startsWith("http") ? v.replace(/\/$/, "") : `https://${v}`;
  }
  return "http://localhost:3000";
}

/** @deprecated Use getPublicAppUrl — kept for existing imports */
export const getAppUrl = getPublicAppUrl;
