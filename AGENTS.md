# AGENTS.md — GoldenGate Private Equity Platform

Guidance for AI coding agents and contributors working on this repository.

## Product context

**GoldenGate** is a **private equity** firm raising capital for **real estate projects**, with a primary focus on **renovations (fix-and-flip)**. The product is investor-facing: onboarding, compliance documents, deal review, subscription, and funding.

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

## Screens (MVP scaffold)

1. **Home** — Value prop, firm focus (PE + real estate renovations), CTA to register.
2. **Register email** — Submit email → **welcome email with magic link** (Resend in prod; link logged in dev if no API key).
3. **Set password** (`/set-password?token=…`) — One-time link from email; user sets password → session cookie.
4. **Dashboard** (`/dashboard`) — Post-auth shell; welcome packet / DocSign content to be wired next.

Additional routes should mirror the journey above as features are built.

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

- **SQLite + Prisma** locally; use `DATABASE_URL` Postgres on Vercel.
- **Magic link** (hashed token, 24h TTL) + **bcrypt** password + **JWT** session cookie (`gg_session`).
- **Email**: `RESEND_API_KEY` only; default `From` is `noreply@modularequity.com`; magic links use Vercel `VERCEL_URL` unless `APP_URL` is set. See `docs/resend-and-production.md`.

Still incremental: Plaid/Mercury/DocSign, Postgres migration for production.
