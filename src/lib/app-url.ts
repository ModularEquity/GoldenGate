/**
 * Base URL for magic links (server-side).
 *
 * On Vercel you do **not** need APP_URL: `VERCEL_URL` is injected automatically
 * (stable production hostname). Optional APP_URL / NEXT_PUBLIC_APP_URL only if
 * you must force a different canonical URL (e.g. custom domain).
 */
export function getAppUrl(): string {
  if (process.env.APP_URL) {
    return process.env.APP_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}
