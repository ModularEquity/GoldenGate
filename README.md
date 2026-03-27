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
npm install
npm run dev
```

- Home: [http://localhost:3000](http://localhost:3000)
- Register email: [http://localhost:3000/register](http://localhost:3000/register)

```bash
npm run build
```

## Environment (later)

- `PLAID_CLIENT_ID`, `PLAID_SECRET`, `PLAID_ENV`
- Payment provider keys if using Stripe alongside Plaid
