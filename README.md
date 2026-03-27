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

Registered Resend? See **[docs/resend-and-production.md](./docs/resend-and-production.md)** for API key, verified **sender domain**, **`APP_URL`** for magic links, and production **Postgres** + **`AUTH_SECRET`**.

Without **`RESEND_API_KEY`**, the magic link is **printed in the server terminal** (dev only).

### Environment

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite file locally (`file:./dev.db`); **use Postgres** on Vercel (serverless can’t persist SQLite) |
| `AUTH_SECRET` | JWT signing (min 32 chars); required in production |
| `APP_URL` | Magic links; production: **`https://golden-gate-seven.vercel.app`** (stable Vercel domain), not the per-deployment URL |
| `RESEND_API_KEY` | Send welcome / magic-link email |
| `EMAIL_FROM` | e.g. **`GoldenGate <noreply@modularequity.com>`** (verified domain in Resend) |

Later: `PLAID_*`, payment provider keys.
