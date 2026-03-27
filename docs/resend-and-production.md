# After you register Resend — checklist

The app sends the **welcome / magic-link** email via Resend’s API. Here’s what to configure beyond creating a Resend account.

## 1. API key

- In Resend: **API Keys** → create a key.
- Set **`RESEND_API_KEY`** in:
  - **Local:** `.env` (never commit)
  - **Vercel:** Project → Settings → Environment Variables (Production + Preview as needed)

## 2. Sender address (`EMAIL_FROM`)

| Scenario | What to use |
|----------|-------------|
| **Quick test** | `GoldenGate <onboarding@resend.dev>` — Resend only delivers to **your Resend account email** (sandbox behavior). Good for verifying the integration. |
| **Real investors** | **Verify your domain** in Resend (DNS records they give you: SPF, DKIM, etc.). Then use e.g. `GoldenGate <noreply@yourdomain.com>`. |

Set **`EMAIL_FROM`** exactly to that address (name + angle brackets optional).

## 3. Magic link base URL (`APP_URL`)

Links look like: `{APP_URL}/set-password?token=...`

- **Production:** `APP_URL=https://your-domain.com` or your **stable** Vercel domain (no trailing slash).
- **Do not** use the per-deployment URL (e.g. `something-abc123-team.vercel.app`) — it changes every deploy and will break old emails. Use the **production domain** from Vercel → *Domains* (e.g. `golden-gate-seven.vercel.app`) or your custom domain.
- **Preview deploys:** Either set `APP_URL` per preview in Vercel or accept that previews need the correct env; wrong `APP_URL` → broken links in emails.

`VERCEL_URL` is a fallback in code, but **`APP_URL` is explicit and recommended** for production.

### GoldenGate (reference)

| Item | Value |
|------|--------|
| Verified sender domain (Resend) | `modularequity.com` — use e.g. `GoldenGate <noreply@modularequity.com>` (or `hello@`, etc.) |
| Stable Vercel URL | `https://golden-gate-seven.vercel.app` — set **`APP_URL`** to this unless you add a custom domain |
| Per-deployment URL | e.g. `golden-gate-2zv1nvn7u-makaminski1337.vercel.app` — **do not** use for `APP_URL` |

If you later add **`modularequity.com`** (or a subdomain) in Vercel, set **`APP_URL`** to that HTTPS URL so magic links match the site users open.

## 4. Production secrets (non-Resend)

| Variable | Why |
|----------|-----|
| **`AUTH_SECRET`** | Signs session JWTs. Min **32 characters**. Generate: `openssl rand -base64 32`. **Required** in production (dev has a fallback; prod does not). |
| **`DATABASE_URL`** | On **Vercel**, use **Postgres** (Neon, Supabase, Vercel Postgres, etc.). SQLite files don’t persist on serverless. Run migrations: `npx prisma migrate deploy` in CI or Vercel build. |

## 5. Vercel build + database

- Add **`DATABASE_URL`** (Postgres connection string).
- Build command already runs **`prisma generate`**. Ensure **`prisma migrate deploy`** runs once per deploy (e.g. in `package.json` `"build": "prisma generate && prisma migrate deploy && next build"` *or* a separate release step — pick what fits your pipeline).

## 6. Optional but recommended

- **Resend dashboard:** Check **Logs** if emails don’t arrive (bounces, API errors).
- **Custom domain on Vercel** so `APP_URL` matches what users see.
- **Legal / product:** Investor communications may need disclaimers; coordinate with counsel (not enforced in code).

## Quick copy: env vars for production

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="<32+ random chars>"
APP_URL="https://golden-gate-seven.vercel.app"
RESEND_API_KEY="re_..."
EMAIL_FROM="GoldenGate <noreply@modularequity.com>"
```

(Adjust `APP_URL` if you use a custom domain on Vercel; keep `EMAIL_FROM` aligned with an address on your verified Resend domain.)
