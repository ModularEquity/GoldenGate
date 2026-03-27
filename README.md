# GoldenGate

Private equity platform for **real estate renovations (fix-and-flip)** — investor onboarding, deal review, and funding.

## Stack

- **Next.js** (App Router) + TypeScript + Tailwind CSS — deploy on **Vercel**
- Repo on **GitHub**
- Planned: **Plaid** (KYC / bank link), **Mercury** (banking ops)

See **[AGENTS.md](./AGENTS.md)** for the full investor journey, conventions, and screen map.

## Flow diagram

Versioned Mermaid diagram: [docs/flow.md](./docs/flow.md). Use **Figma** or **Lucidchart** for high-fidelity UI mockups of the same flow.

## Develop

```bash
cp .env.example .env   # optional; defaults work for local SQLite
npm install
npx prisma migrate dev   # first time: creates prisma/dev.db
npm run dev
```

- Home: [http://localhost:3000](http://localhost:3000)
- Register email: [http://localhost:3000/register](http://localhost:3000/register) → magic link email → **set password** → **dashboard**

```bash
npm run build
```

### Email (Resend)

On **Vercel** you only need **`RESEND_API_KEY`** (secret). **Do not** set `APP_URL` or `EMAIL_FROM` unless you want overrides: magic links use Vercel’s automatic **`VERCEL_URL`**, and the default sender is **`GoldenGate <noreply@modularequity.com>`** (your verified domain).

See **[docs/resend-and-production.md](./docs/resend-and-production.md)** for production **Postgres** + **`AUTH_SECRET`**.

Without **`RESEND_API_KEY`**, the magic link is **printed in the server terminal** (dev only).

### Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite file locally (`file:./dev.db`); **use Postgres** on Vercel (serverless can’t persist SQLite) |
| `AUTH_SECRET` | JWT signing (min 32 chars); required in production |
| `RESEND_API_KEY` | Send welcome / magic-link email (**only email-related secret required**) |
| `APP_URL` | *Optional* — force magic-link base URL (e.g. custom domain). If unset on Vercel, **`VERCEL_URL`** is used. |
| `EMAIL_FROM` | *Optional* — override default `GoldenGate <noreply@modularequity.com>` |

Later: `PLAID_*`, payment provider keys.
