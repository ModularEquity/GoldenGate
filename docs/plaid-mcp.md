# Plaid MCP (Model Context Protocol)

Use Plaid’s **Dashboard MCP** in Cursor to ask questions about your integration, troubleshoot Link issues, and browse Plaid docs from the IDE.

## Official docs

- **[Plaid MCP resources](https://www.plaid.com/docs/resources/mcp/)** — setup, OAuth, and supported clients (Cursor, VS Code, Claude Desktop, etc.).
- Plaid publishes examples in their **[AI toolkit](https://github.com/plaid/ai-coding-toolkit)** repo.

## Cursor setup (summary)

1. Follow Plaid’s guide to create an OAuth token with the **`mcp:dashboard`** scope (client credentials grant).
2. In Cursor, add an MCP server entry (e.g. **Streamable HTTP** to Plaid’s Dashboard MCP endpoint — see current URL in Plaid docs; historically documented as `https://api.dashboard.plaid.com/mcp`).
3. **Note:** Dashboard MCP is oriented toward **production** dashboard access; sandbox app development still uses `PLAID_CLIENT_ID` / `PLAID_SECRET` in this Next.js app.

## This app vs MCP

- **GoldenGate** uses the **Plaid Link + Node SDK** (`plaid` package) for bank linking — see `/api/plaid/*` and **Fund** page.
- **Plaid MCP** is optional tooling for **developers** in the IDE, not something end investors enable.
