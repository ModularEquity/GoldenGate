# Postgres on Vercel (GoldenGate)

## “Vercel Postgres” today

**Vercel’s first-party “Vercel Postgres” product is no longer available for new projects.**  
Vercel now expects you to attach Postgres through the **[Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=postgres)** (often **Neon** or **Supabase**). Existing “Vercel Postgres” DBs were migrated to Neon in **December 2024** ([docs](https://vercel.com/docs/storage/vercel-postgres/usage-and-pricing)).

So: **you can still use Postgres with Vercel** — install a Marketplace integration (Neon is the common path) and set **`DATABASE_URL`** on your project. This app is configured for **PostgreSQL** + Prisma.

---

## Recommended path: Neon via Vercel Marketplace

1. **Vercel** → your project → **Storage** / **Marketplace** → add **Neon** (or another Postgres provider).
2. Connect the integration — Vercel/Neon inject **`DATABASE_URL`** (pooled) and **`POSTGRES_URL_NON_POOLING`** (direct). Prisma uses both; **no manual `DIRECT_URL`**.
3. **Build:** This repo includes **`vercel.json`** so the default build runs **`npm run build:vercel`** (`prisma migrate deploy` + `next build`). If you override the build command in the Vercel UI, use the same.

4. **Redeploy** the latest commit so the build runs `prisma migrate deploy` and creates tables.

---

## After Neon is integrated — quick checklist

| Step | What to verify |
|------|----------------|
| **Env** | **Vercel → Settings → Environment Variables:** `DATABASE_URL` is present for **Production** (and **Preview** if you want DB on preview deploys). |
| **Build** | Latest deploy **succeeds** — if the build fails at `prisma migrate deploy`, see *Troubleshooting* below. |
| **Smoke test** | Open your site → **Register** with an email → confirm row in **Neon SQL Editor** (`User` table) or that registration returns success. |
| **Local dev** | Copy the **connection string** from Neon (Dashboard → your project → **Connection details**) into local `.env` as `DATABASE_URL` if you want the same DB as production, or create a **separate Neon branch / dev project** (recommended). |

### Troubleshooting: `migrate deploy` errors on Vercel

If **`POSTGRES_URL_NON_POOLING`** is missing from the project env, add it from Neon (**unpooled** / **DATABASE_URL_UNPOOLED**). Prisma uses it for migrations via `directUrl` in `schema.prisma`.

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
# copy .env.example to .env — DATABASE_URL matches docker-compose.yml
npx prisma migrate deploy
npm run dev
```

Without Docker, point **`DATABASE_URL`** at a cloud dev DB (e.g. Neon free project).

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
| `DATABASE_URL` | **Pooled** connection — Prisma Client at runtime. |
| `POSTGRES_URL_NON_POOLING` | **Direct** connection — **`prisma migrate`** (Neon/Vercel template name). |

**Vercel + Neon integration:** these are usually **injected automatically**. No `DIRECT_URL` required.

**Local Docker:** set **`POSTGRES_URL_NON_POOLING`** to the **same** URL as **`DATABASE_URL`** (see `.env.example`).

Never commit secrets; set variables in Vercel **Environment Variables**.
