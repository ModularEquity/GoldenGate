# Plaid — quick reference (Modular Equity)

**Official docs:** [https://plaid.com/docs/](https://plaid.com/docs/) — always treat Plaid’s site as source of truth; this file is a **project-specific** cheat sheet.

## What we use Plaid for

- **Link** — end users connect a bank (institution login handled by Plaid).
- **Auth** — ACH routing/account numbers (`/auth/get`) for verification copy.
- **Transactions** — requested in `link_token` for future balance/activity (product array).

## Standard integration flow (from Plaid Quickstart)

1. **Server:** `POST /link/token/create` → returns **`link_token`** (short-lived).
2. **Client:** Initialize **Plaid Link** with `link_token` (`react-plaid-link` in our app).
3. **Client:** On success, Link returns **`public_token`** (one-time).
4. **Server:** `POST /item/public_token/exchange` with `public_token` → **`access_token`** + **`item_id`** (store per user; treat as secret).
5. **Server:** Use **`access_token`** for product calls (e.g. `/accounts/get`, `/auth/get`).

**Concepts**

- **Item** — one bank login at one institution (may cover multiple accounts).
- **access_token** — authenticates API calls for that Item (never expose to browser).

## This repo

| Piece | Location |
|-------|----------|
| Plaid client (env, base path) | `src/lib/plaid-server.ts` |
| Create Link token | `POST /api/plaid/create-link-token` — `Products.Auth`, `Products.Transactions`, `CountryCode.Us` |
| Exchange public token | `POST /api/plaid/exchange-public-token` — stores `PlaidAccount`, sets `User.bankLinkedAt`, optional `authGet` |
| UI | `src/components/PlaidLinkButton.tsx`, **Fund** page `src/app/dashboard/fund/page.tsx` |

**Env vars**

- `PLAID_CLIENT_ID`
- `PLAID_SECRET` **or** `PLAID_API_SECRET` (same value; Vercel often names the latter)
- `PLAID_ENV` — `sandbox` (default in code) vs `production`

## Products (high level)

| Product | Use |
|---------|-----|
| **Auth** | Bank account + routing numbers for ACH verification (`auth/get`). |
| **Transactions** | Historical transactions (requires Transactions subscription in Dashboard for production). |

## Sandbox testing

- Dashboard → **Sandbox** keys.
- Typical test user in Plaid examples: `user_good` / `pass_good` (see [Quickstart](https://plaid.com/docs/quickstart/)).
- Optional: `/sandbox/public_token/create` to bypass Link in Sandbox only.

## OAuth institutions

Some banks use OAuth redirect; configure **redirect URIs** in Plaid Dashboard and see [OAuth guide](https://plaid.com/docs/link/oauth/).

## Update mode & errors

- **Update mode** — re-link if Item errors (password change, etc.).
- **Duplicate Items** — avoid linking same institution twice for same user ([docs](https://plaid.com/docs/link/duplicate-items/)).
- **Invalid link token** — tokens expire (~30 min); create a new `link_token`.

## MCP / IDE tooling

Optional **Plaid Dashboard MCP** for developers in Cursor — see `docs/plaid-mcp.md`. Not used by investors.

## Money movement

Production ACH pulls/transfers often use **Plaid + partner** (e.g. Stripe, Dwolla). We currently **log funding intents** in-app; wire production ACH separately.
