# Postgres on Vercel (GoldenGate)

## “Vercel Postgres” today

**Vercel’s first-party “Vercel Postgres” product is no longer available for new projects.**  
Vercel now expects you to attach Postgres through the **[Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=postgres)** (often **Neon** or **Supabase**). Existing “Vercel Postgres” DBs were migrated to Neon in **December 2024** ([docs](https://vercel.com/docs/storage/vercel-postgres/usage-and-pricing)).

So: **you can still use Postgres with Vercel** — install a Marketplace integration (Neon is the common path). This app’s Prisma schema expects **prefixed** env names that match your Vercel integration (e.g. **`goldengate_DATABASE_URL`**, **`goldengate_POSTGRES_URL_NON_POOLING`**).

---

## Recommended path: Neon via Vercel Marketplace

1. **Vercel** → your project → **Storage** / **Marketplace** → add **Neon** (or another Postgres provider).
2. Connect the integration — Neon injects variables **prefixed** with your project slug (e.g. `goldengate_`). Prisma is wired to **`goldengate_DATABASE_URL`** + **`goldengate_POSTGRES_URL_NON_POOLING`**. If your prefix differs, update `prisma/schema.prisma` to match.
3. **Build:** This repo includes **`vercel.json`** so the default build runs **`npm run build:vercel`** (`prisma migrate deploy` + `next build`). If you override the build command in the Vercel UI, use the same.

4. **Redeploy** the latest commit so the build runs `prisma migrate deploy` and creates tables.

---

## After Neon is integrated — quick checklist

| Step | What to verify |
|------|----------------|
| **Env** | **`goldengate_DATABASE_URL`** and **`goldengate_POSTGRES_URL_NON_POOLING`** present (Neon integration). |
| **Build** | Latest deploy **succeeds** — if the build fails at `prisma migrate deploy`, see *Troubleshooting* below. |
| **Smoke test** | Open your site → **Register** with an email → confirm row in **Neon SQL Editor** (`User` table) or that registration returns success. |
| **Local dev** | Use `.env` with **`goldengate_DATABASE_URL`** and **`goldengate_POSTGRES_URL_NON_POOLING`** (same values for Docker), or point at a Neon dev branch. |

### Troubleshooting: `migrate deploy` errors on Vercel

If the prefixed **`goldengate_POSTGRES_URL_NON_POOLING`** is missing, add it manually (same value as Neon’s unpooled URL). Prisma uses it for `directUrl` in `schema.prisma`.

---

## Neon Free plan limits (reference)

Source: [Neon pricing](https://neon.com/pricing) (as of documentation update — **verify on Neon’s site**).

| Quota | Free plan |
|-------|-----------|
| **Price** | $0 / month (no credit card required) |
| **Projects** | 100 per account |
| **Compute** | **100 CU-hours/month per project** (compute sizes up to **2 CU** / ~8 GB RAM) |
| **Storage** | **0.5 GB per project** |
| **Branches** | 10 per project |
| **Scale to zero** | After ~5 min idle (default) |
| **Restore / time travel** | Up to **6 hours** or **1 GB** of data changes (free tier window) |

**CU-hour:** Neon bills compute by how long the DB runs at a given size. Idle workloads often stay within the free allowance because compute scales down.

If you outgrow Free, Neon offers usage-based **Launch** / **Scale** plans — see their pricing page.

---

## Other Marketplace options

- **Supabase**, **Prisma Postgres**, etc. — also Postgres; connect **`DATABASE_URL`** the same way.
- Limits differ by provider; check their pricing pages.

---

## Local development

This repo uses **PostgreSQL** (not SQLite). Easiest local setup:

```bash
docker compose up -d
# copy .env.example to .env — goldengate_* URLs match docker-compose.yml
npx prisma migrate deploy
npm run dev
```

Without Docker, set **`goldengate_DATABASE_URL`** / **`goldengate_POSTGRES_URL_NON_POOLING`** to a cloud dev DB (e.g. Neon).

---

## Prisma commands

| Command | When |
|---------|------|
| `npx prisma migrate deploy` | Apply migrations (CI / Vercel **`build:vercel`**) |
| `npx prisma migrate dev` | Create a new migration after changing `schema.prisma` (dev only) |

---

## Environment variables

| Variable | Purpose |
|----------|---------|
| `goldengate_DATABASE_URL` | **Pooled** connection — Prisma Client at runtime. |
| `goldengate_POSTGRES_URL_NON_POOLING` | **Direct** connection — **`prisma migrate`**. |

Prefix **`goldengate_`** matches this Vercel project’s Neon integration. Rename in `schema.prisma` if your integration uses a different prefix.

**Local Docker:** same URL for both vars (see `.env.example`).

Never commit secrets; Vercel injects them via the Neon integration.
