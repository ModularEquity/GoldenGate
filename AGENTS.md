# AGENTS.md — Modular Equity Private Equity Platform

Guidance for AI coding agents and contributors working on this repository.

## Product context

**Modular Equity** is a **private equity** firm raising capital for **real estate projects**, with a primary focus on **renovations (fix-and-flip)**. The product is investor-facing: onboarding, compliance documents, deal review, subscription, and funding.

## Tech stack & integrations

| Layer | Tool | Role |
|--------|------|------|
| Front-end & hosting | **Vercel** | Deploy Next.js app |
| Source control | **GitHub** | Repository |
| Bank linking / payments | **Plaid** (and optionally **Stripe** per product notes) | KYC, connect account, ACH |
| Business banking | **Mercury** | Operating bank (wire/ACH instructions, reconciliation — integrate via ops/API as applicable) |

Agents should prefer environment variables for all secrets (`PLAID_*`, `STRIPE_*`, etc.) and never commit credentials.

## Investor journey (target flow)

High-level steps for implementation and UX alignment:

| Step | Process | Description | Actor | Notes |
|------|---------|-------------|--------|--------|
| 1 | Register email | Free-form or Gmail | Investor | Entry point |
| 2 | Register investor account | DocSign | Investor | Legal onboarding |
| 2a | Questionnaire | DocSign | Investor | Suitability / accreditation |
| 2b | PPM | Read-only | Investor | Private placement memorandum |
| 2c | Risk disclosures | DocSign | Investor | |
| 2d | W-9 / W-8BEN / W-8BEN-E | DocSign | Investor | Tax |
| 2d | Add account — wire / ACH instructions | DocSign | Investor | Mercury-aligned instructions |
| 3 | Operating doc | Read-only | Investor | |
| 4 | Cap table | Read-only | Investor | |
| 5 | Review deal | Read-only | Investor | Fix-and-flip deal room |
| 6 | Subscribe to deal | DocSign | Investor | |
| 7 | Fund deal (ACH) | Plaid / Stripe | Investor | Or auto-debit on specified day |

**DocSign** in tables above means e-signature / document workflow (integrate with your chosen provider; placeholder modules are fine until vendor is chosen).

## Google Docs quick links (investor)

Centralized in `src/lib/investor-resources.ts` — PPM, risk disclosures, operating PDF, Deal Room Drive folder.

## Screens (MVP scaffold)

1. **Home** — Value prop; CTAs to **Register** and **Login**.
2. **Register** (`/register`) — Email → welcome magic link → **Set password** (`/set-password`).
3. **Login** (`/login`) — Email + password → **Dashboard**. **Forgot password** (`/forgot-password`) → email → **Reset password** (`/reset-password`).
4. **Dashboard** (`/dashboard`) — Investor hub; **FAQ** (`/dashboard/faq`) — logged-in accordion + TOC.
5. **Sub-pages** — `/dashboard/onboarding` (PPM/risk Google Doc links, tax, banking copy), `/dashboard/documents` (operating PDF link, cap table stub), `/dashboard/deals` (Deal Room Drive link), `/dashboard/subscribe` (stub).
6. **Fund** (`/dashboard/fund`) — Plaid Link, **wallets** (DB), **funding** intents (DB log; live ACH via Plaid Transfer / Stripe later).

Additional routes mirror the investor journey table as features are built.

## Design / mockups

- **Figma or Lucidchart**: Product/design owns clickable mockups of the full flow. Repo does not replace those tools; link or attach exports in internal docs when available.
- **In-repo**: Use `docs/flow.md` (Mermaid) as a lightweight, versioned view of the user flow for engineers and agents.

## Code conventions for agents

- **Framework**: Next.js (App Router), TypeScript, Tailwind CSS — deployable on Vercel.
- **Accessibility**: Semantic HTML, labels on forms, focus states.
- **Security**: Validate server-side for any future API routes; sanitize inputs.
- **Naming**: Prefer clear route segments (`/register`, `/deals/[id]`, etc.).
- **When adding integrations**: Stub clients behind interfaces (`lib/plaid.ts`, `lib/docusign.ts`) with env-based configuration.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Build: `npm run build`.

## Auth & data (implemented)

- **PostgreSQL + Prisma** — local Docker or cloud; Vercel uses Marketplace Postgres (e.g. Neon). See `docs/database-vercel-postgres.md`.
- **NextAuth (Auth.js)** — Google OAuth + credentials; JWT sessions; **`UserRole`**: `INVESTOR` vs `EMPLOYEE` (email `@modularequity.com` → Employee). Production needs **`AUTH_SECRET`** (≥32 chars); **`AUTH_URL`** is optional on Vercel (derived from **`VERCEL_URL`** if unset).
- **Magic link** with purpose: `SET_PASSWORD` (welcome) vs `RESET_PASSWORD` (forgot flow); 24h TTL; **bcrypt** for passwords.
- **Email**: `RESEND_API_KEY`; default `From` is `Modular Equity <noreply@modularequity.com>`. See `docs/resend-and-production.md`.

Still incremental: Plaid/Mercury/DocSign, Postgres migration for production.
