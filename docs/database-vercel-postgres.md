# Postgres on Vercel (GoldenGate)

## “Vercel Postgres” today

**Vercel’s first-party “Vercel Postgres” product is no longer available for new projects.**  
Vercel now expects you to attach Postgres through the **[Vercel Marketplace](https://vercel.com/marketplace?category=storage&search=postgres)** (often **Neon** or **Supabase**). Existing “Vercel Postgres” DBs were migrated to Neon in **December 2024** ([docs](https://vercel.com/docs/storage/vercel-postgres/usage-and-pricing)).

So: **you can still use Postgres with Vercel** — install a Marketplace integration (Neon is the common path) and set **`DATABASE_URL`** on your project. This app is configured for **PostgreSQL** + Prisma.

---

## Recommended path: Neon via Vercel Marketplace

1. **Vercel** → your project → **Storage** / **Marketplace** → add **Neon** (or another Postgres provider).
2. Connect the integration so **`DATABASE_URL`** is injected into your environment.
3. **Build:** This repo includes **`vercel.json`** so the default build runs **`npm run build:vercel`** (`prisma migrate deploy` + `next build`). If you override the build command in the Vercel UI, use the same.

4. Redeploy.

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

## Environment variable

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (`postgresql://...`) |

Never commit secrets; set `DATABASE_URL` in Vercel **Environment Variables**.
