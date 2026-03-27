# After you register Resend — checklist

The app sends the **welcome / magic-link** email via Resend’s API. Here’s what to configure beyond creating a Resend account.

## 1. API key

- In Resend: **API Keys** → create a key.
- Set **`RESEND_API_KEY`** in:
  - **Local:** `.env` (never commit)
  - **Vercel:** Project → Settings → Environment Variables

**Critical on Vercel:** add **`RESEND_API_KEY`** for **Production** (not only Preview). **Redeploy** after adding or changing it — env vars are baked in at build/runtime; a missing key means **Resend never runs** (the register form will say mail isn’t configured yet).

If Resend returns an error (wrong domain, invalid key), check **Vercel → Deployment → Logs** for `[email] Resend API error:`.

## 2. Sender address — **no env var required**

The app defaults to **`GoldenGate <noreply@modularequity.com>`** (verified domain). You don’t need to put this in Vercel secrets.

Optional: set **`EMAIL_FROM`** only if you want a different `From` address.

## 3. Magic link URL — **no `APP_URL` secret required on Vercel**

Links look like: `{base}/set-password?token=...`

- **Vercel** injects **`VERCEL_URL`** automatically (no secret). The app builds `https://{VERCEL_URL}` for magic links.
- **Optional:** set **`APP_URL`** only if you must force a canonical URL (e.g. custom domain that differs from `VERCEL_URL`).

**Note:** Each deployment gets its own `*.vercel.app` hostname; **production** uses your production deployment’s `VERCEL_URL`. For a single stable link in emails, add a **custom domain** in Vercel or set **`APP_URL`** to that HTTPS URL once.

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

## Quick copy: env vars for production (minimum)

```env
goldengate_DATABASE_URL="postgresql://..."
goldengate_POSTGRES_URL_NON_POOLING="postgresql://..."
AUTH_SECRET="<32+ random chars>"
RESEND_API_KEY="re_..."
```

`APP_URL` and `EMAIL_FROM` are **optional** (defaults cover Vercel + `noreply@modularequity.com`). On Vercel, Neon injects the `goldengate_*` DB vars automatically.
