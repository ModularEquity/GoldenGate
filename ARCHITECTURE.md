# Architecture — Modular Equity

**Purpose:** Single entry point for **humans and AI agents** to understand how this repo is structured, what to load for a task, and where authoritative detail lives.

**How to use (AI context routing)**

| Task type | Load first | Then |
|-----------|------------|------|
| Auth / sessions / OAuth | `ARCHITECTURE.md` §Auth, `src/auth.ts`, `src/auth.config.ts`, `middleware.ts`, `docs/google-oauth.md` | `src/types/next-auth.d.ts` |
| Database / Prisma | `prisma/schema.prisma`, `docs/database-vercel-postgres.md` | Migration SQL under `prisma/migrations/` |
| Investor onboarding / tax PDF | `src/lib/onboarding-status.ts`, `src/app/dashboard/onboarding/**` | `src/lib/tax-profile.ts`, `src/lib/tax-pdf.ts` |
| Deals / subscriptions | `src/lib/deals.ts`, `prisma/schema.prisma` (`Deal`, `DealSubscription`) | `src/app/dashboard/deals/**`, `src/app/dashboard/subscribe/**` |
| Bank link / Plaid | `docs/plaid-reference.md`, `src/lib/plaid-server.ts` | `src/app/api/plaid/**`, `src/components/PlaidLinkButton.tsx` |
| Email / magic links | `src/lib/email.ts`, `docs/resend-and-production.md` | `src/app/api/register-email`, `src/lib/magic-link.ts` |
| Referrals / share links | `ARCHITECTURE.md` §Referrals | `src/app/dashboard/profile/page.tsx`, `src/app/api/claim-referral` |
| Product / journey (narrative) | `AGENTS.md` | `docs/flow.md` |
| Internal tech stack links (members) | `src/lib/technical-catalogue.ts` | `/dashboard/technical-catalogue` |

**Authoritative narrative (product + conventions):** [`AGENTS.md`](./AGENTS.md)

---

## System context

- **App:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS.
- **Hosting:** Vercel (build: `npm run build:vercel` → Prisma migrate + Next build).
- **Database:** PostgreSQL (Neon via Vercel; local Docker). Prisma ORM.
- **Auth:** Auth.js v5 (`next-auth`) — Google OAuth + credentials; JWT sessions; Prisma adapter.
- **Email:** Resend (optional key `RESEND_API_KEY`).

---

## Repository map

```
src/app/           # Routes (App Router): pages + route handlers
  api/             # REST-style API routes (auth, plaid, deals, funding, etc.)
  dashboard/       # Logged-in investor/employee UI (`layout.tsx` wraps pages in `DashboardShell` — left nav ribbon)
src/components/    # React client/server components
src/lib/           # Shared helpers (db, email, roles, deals, plaid, etc.)
prisma/            # schema.prisma + migrations
docs/              # Deep-dive docs (DB, Resend, Google OAuth, Plaid)
middleware.ts      # Edge: JWT check for /dashboard (no Prisma)
```

---

## Authentication

- **Config split:** `src/auth.config.ts` (edge-safe callbacks) + `src/auth.ts` (Prisma + providers).
- **Session:** JWT; custom claims: `role` (`INVESTOR` | `EMPLOYEE`), `email` domain `@modularequity.com` → employee.
- **Secrets:** `AUTH_SECRET` (or Vercel fallback). **OAuth base URL:** `AUTH_URL` / `APP_URL` / `NEXT_PUBLIC_APP_URL` for custom domains — see `docs/google-oauth.md`.
- **Middleware:** `getToken` from `next-auth/jwt` — must use same secret as NextAuth.

---

## Data model (high level)

- **User** — auth fields, onboarding timestamps, `taxProfileJson`, `referralCode`, `referredByCode`, `bankLinkedAt`.
- **Deal** — financials, `propertyUrl`, `thumbnailUrl` (OG image), `maxSubscriptionPctOfTotalCost`.
- **DealSubscription** — user + deal + `amountCents` (min $5k, max pct × total cost — `src/lib/subscription-rules.ts`).
- **PlaidAccount**, **ManualBankAccount**, **FundingIntent**, **Wallet**, **MagicLinkToken**, Auth.js **Account/Session/VerificationToken**.

---

## Referrals & “Share” link

- Each user gets a unique **`referralCode`** (lazy-generated or on OAuth `createUser`).
- **Profile:** `/dashboard/profile` — shows `https://<app>/register?ref=<CODE>` with **Copy link** (`ShareInviteLink`).
- **Registration:** `?ref=` stored (sessionStorage + email API); **after login**, `ClaimReferralOnDashboard` calls `POST /api/claim-referral` to set `referredByCode` for Google users.
- **Stable URL:** set `NEXT_PUBLIC_APP_URL` (e.g. `https://modularequity.com`) in production.

---

## External integrations (summary)

| Service | Role | Config |
|---------|------|--------|
| Vercel | Host | — |
| Neon | Postgres | `goldengate_*` env vars |
| Google | OAuth login | `AUTH_GOOGLE_*`, redirect URIs |
| Resend | Email | `RESEND_API_KEY` |
| Plaid | Bank link | `PLAID_*` — see `docs/plaid-reference.md` |

---

## Key user routes

| Path | Role |
|------|------|
| `/` | Marketing |
| `/register`, `/login`, `/set-password` | Auth |
| `/dashboard` | Hub |
| `/dashboard/onboarding/*` | Onboarding steps |
| `/dashboard/deals`, `/dashboard/deals/[slug]` | Deals |
| `/dashboard/subscribe`, `/dashboard/subscribe/[slug]` | Subscription amounts |
| `/dashboard/fund` | Plaid + manual bank + funding intents |
| `/dashboard/profile` | Share / invite link |
| `/dashboard/team/*` | Employee-only (e.g. new deal) |

---

## Changing behavior safely

1. **Schema change** → edit `prisma/schema.prisma`, add migration, run `prisma migrate deploy` on deploy.
2. **Auth behavior** → prefer `auth.ts` / `auth.config.ts`; avoid importing Prisma in `middleware.ts`.
3. **New env vars** → document in `README.md` and `.env.example`.

---

## Related documents

- [`AGENTS.md`](./AGENTS.md) — product journey, screen map, agent conventions  
- [`docs/plaid-reference.md`](./docs/plaid-reference.md) — Plaid API usage in this repo  
- [`docs/google-oauth.md`](./docs/google-oauth.md) — redirect URIs  
- [`docs/resend-and-production.md`](./docs/resend-and-production.md) — email + env  
- [`docs/database-vercel-postgres.md`](./docs/database-vercel-postgres.md) — Neon / Postgres  
