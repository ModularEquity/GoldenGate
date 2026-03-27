# Modular Equity (investor portal)

Private equity platform for **real estate renovations (fix-and-flip)** — investor onboarding, deal review, and funding.

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS — deploy on **Vercel**
- Repo on **GitHub**
- Planned: **Plaid** (KYC / bank link), **Mercury** (banking ops)

See **[AGENTS.md](./AGENTS.md)** for the full investor journey, conventions, and screen map.

## Flow diagram

Versioned Mermaid diagram: [docs/flow.md](./docs/flow.md). Use **Figma** or **Lucidchart** for high-fidelity UI mockups of the same flow.

## Develop

PostgreSQL is required (see **[docs/database-vercel-postgres.md](./docs/database-vercel-postgres.md)**).

```bash
cp .env.example .env
npm install
docker compose up -d
npx prisma migrate deploy
npm run dev
```

**Vercel + Neon:** after connecting Neon, **redeploy** so migrations run. Post-checklist: [docs/database-vercel-postgres.md](./docs/database-vercel-postgres.md#after-neon-is-integrated--quick-checklist).

- Home: [http://localhost:3000](http://localhost:3000)
- **Login:** `/login` — email + password; **Forgot password** → reset link → `/reset-password`
- Register: `/register` → magic link → **set password** → **dashboard** (`/dashboard` hub + investor sections)

```bash
npm run build
```

### Email (Resend)

On **Vercel** you only need **`RESEND_API_KEY`** (secret). **Do not** set `APP_URL` or `EMAIL_FROM` unless you want overrides: magic links use Vercel’s automatic **`VERCEL_URL`**, and the default sender is **`Modular Equity <noreply@modularequity.com>`** (your verified domain).

See **[docs/resend-and-production.md](./docs/resend-and-production.md)** for **Postgres**, **`AUTH_SECRET`**, and **Google OAuth** (`AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET`).

Without **`RESEND_API_KEY`**, the magic link is **printed in the server terminal** (dev only).

### Environment

| Variable | Purpose |
|----------|---------|
| `goldengate_DATABASE_URL` | **PostgreSQL** pooled (Neon / Vercel — prefixed by integration) |
| `goldengate_POSTGRES_URL_NON_POOLING` | **Direct** URL for migrations (local: same as pooled URL) |
| `AUTH_SECRET` | Random string for **session signing** (min 32 chars). **Not** the Google OAuth secret. Generate: `npm run auth:secret`. On **Vercel**, if unset, the app uses a **stable fallback** derived from `VERCEL_PROJECT_ID` so deploys don’t 500 — still set **`AUTH_SECRET`** for production. |
| `AUTH_URL` or **`APP_URL`** or **`NEXT_PUBLIC_APP_URL`** | **Set to `https://modularequity.com`** (no trailing slash) if you use a custom domain — fixes **`redirect_uri_mismatch`** when `VERCEL_URL` is still `*.vercel.app` |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | Google sign-in (register + login) |
| Google OAuth redirect | **Required in Google Cloud:** `https://<your-domain>/api/auth/callback/google` — see **[docs/google-oauth.md](./docs/google-oauth.md)** |
| `RESEND_API_KEY` | Transactional email (welcome / reset) |
| `APP_URL` | *Optional* — magic-link base URL; else **`VERCEL_URL`** |
| `EMAIL_FROM` | *Optional* — override default `Modular Equity <noreply@modularequity.com>` |

**Plaid:** `PLAID_CLIENT_ID`, `PLAID_SECRET` or **`PLAID_API_SECRET`** (same value), optional `PLAID_ENV` (`sandbox` / `production`). See `docs/plaid-mcp.md`.

**Deals:** Stored in Postgres (`Deal` model). **Employees** (`@modularequity.com`) add deals at **`/dashboard/team/deals/new`** — listing URL is used to fetch an **Open Graph** image for thumbnails. `POST /api/deals` / `PATCH /api/deals/[slug]` are employee-only.

**Subscriptions:** Investors use **`/dashboard/subscribe`** to pick an **OPEN** deal (table + radio) and **`/dashboard/subscribe/[slug]`** to enter an amount. Rules: **min $5,000**; **max = `maxSubscriptionPctOfTotalCost` × total cost** (default **20%**). Saved in **`DealSubscription`** via **`POST /api/deals/[slug]/subscribe`**.
