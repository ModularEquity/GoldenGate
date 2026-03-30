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

## `DEPOT_TOKEN` (optional)

If you use the **[Depot CLI](https://depot.dev/docs/cli/installation)** locally (e.g. `depot build`, `depot configure-docker`) or wire **Depot** into a custom workflow step, set an organization API token as **`DEPOT_TOKEN`** in your shell or in **`.env`** (never commit the real value).

- Create or rotate tokens in the [Depot dashboard](https://depot.dev) → your org → **Settings** / **API** (see [Depot API authentication](https://depot.dev/docs/api/authentication)).
- **GitHub Actions** jobs that only use `runs-on: depot-ubuntu-24.04` do **not** require `DEPOT_TOKEN` in the workflow unless you add explicit Depot CLI steps.
- If a token is ever exposed (chat, logs, PR), **revoke and rotate** it in Depot immediately.

## Troubleshooting

- **`Requested labels: depot-ubuntu-24.04` job stuck / no runners**: Depot app not installed, wrong org, or public-repo runner group not enabled.
- **Prisma / env errors**: Ensure `prisma/schema.prisma` `env()` names match the `env:` block in `ci.yml`.
