# CI with Depot (GitHub Actions)

This repo’s **`.github/workflows/ci.yml`** runs on **[Depot-managed GitHub Actions runners](https://depot.dev/docs/github-actions/overview)** (`runs-on: depot-ubuntu-24.04`) so jobs get faster CPUs and **[Depot Cache](https://depot.dev/docs/cache/integrations/github-actions)** for `actions/cache` and `actions/setup-node` caching.

## One-time setup (org owners)

1. Sign in at [depot.dev](https://depot.dev) and open your organization.
2. Go to **GitHub Actions** → **Connect to GitHub** and install the Depot GitHub App for the org/repo that contains this project.
3. If the repo is **public**, in GitHub: **Organization settings → Actions → Runner groups** → allow runners for **public repositories** (see [Depot quickstart](https://depot.dev/docs/github-actions/quickstart)).
4. Merge a PR or push to `main` / `master` — the workflow should run on Depot runners.

## What the workflow does

- `npm ci` → `npm run lint` → `npm run build` (same as local/Vercel compile).
- Dummy `goldengate_*` Postgres URLs satisfy Prisma **generate** only; migrations are **not** applied in CI (Vercel handles `prisma migrate deploy` on deploy).

## Troubleshooting

- **`Requested labels: depot-ubuntu-24.04` job stuck / no runners**: Depot app not installed, wrong org, or public-repo runner group not enabled.
- **Prisma / env errors**: Ensure `prisma/schema.prisma` `env()` names match the `env:` block in `ci.yml`.
