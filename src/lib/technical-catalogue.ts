/**
 * Internal “technical catalogue” — vendors & tools used across Modular Equity infra.
 * Shown on `/dashboard/technical-catalogue` (logged-in users only).
 */

export type TechCatalogueItem = {
  name: string;
  category: string;
  /** One-line how we use it */
  description: string;
  websiteUrl: string;
  docsUrl: string;
  /**
   * Vendor MCP docs or MCP deployment guide. `null` = no first-party MCP page;
   * use the MCP overview link in the UI instead.
   */
  mcpUrl: string | null;
};

/** Stable sort: category then name */
export const TECHNICAL_CATALOGUE: TechCatalogueItem[] = [
  {
    name: "Vercel",
    category: "Hosting & edge",
    description: "Production hosting, previews, and serverless/edge for the Next.js app.",
    websiteUrl: "https://vercel.com",
    docsUrl: "https://vercel.com/docs",
    mcpUrl: "https://vercel.com/docs/mcp",
  },
  {
    name: "Neon",
    category: "Database",
    description: "Serverless Postgres (pooled + direct URLs) used with Prisma.",
    websiteUrl: "https://neon.tech",
    docsUrl: "https://neon.tech/docs/introduction",
    mcpUrl: "https://mcp.neon.tech/",
  },
  {
    name: "PostgreSQL",
    category: "Database",
    description: "Underlying database engine (managed by Neon in production).",
    websiteUrl: "https://www.postgresql.org",
    docsUrl: "https://www.postgresql.org/docs/",
    mcpUrl: null,
  },
  {
    name: "Prisma",
    category: "ORM & migrations",
    description: "Schema, migrations, and type-safe DB access.",
    websiteUrl: "https://www.prisma.io",
    docsUrl: "https://www.prisma.io/docs",
    mcpUrl: null,
  },
  {
    name: "Next.js",
    category: "Application framework",
    description: "App Router, API routes, and React server components.",
    websiteUrl: "https://nextjs.org",
    docsUrl: "https://nextjs.org/docs",
    mcpUrl: null,
  },
  {
    name: "Auth.js (NextAuth)",
    category: "Authentication",
    description: "Google OAuth, credentials, JWT sessions, Prisma adapter.",
    websiteUrl: "https://authjs.dev",
    docsUrl: "https://authjs.dev",
    mcpUrl: null,
  },
  {
    name: "Resend",
    category: "Email",
    description: "Transactional email (registration links, notifications).",
    websiteUrl: "https://resend.com",
    docsUrl: "https://resend.com/docs",
    mcpUrl: null,
  },
  {
    name: "Plaid",
    category: "Banking & ACH",
    description: "Bank linking (Link, tokens, account metadata) for funding flows.",
    websiteUrl: "https://plaid.com",
    docsUrl: "https://plaid.com/docs/",
    mcpUrl: "https://plaid.com/docs/resources/mcp/",
  },
  {
    name: "Supabase",
    category: "Platform (optional / reference)",
    description: "Postgres + auth/storage patterns; MCP tooling for agents when applicable.",
    websiteUrl: "https://supabase.com",
    docsUrl: "https://supabase.com/docs",
    mcpUrl: "https://supabase.com/docs/guides/getting-started/mcp",
  },
  {
    name: "GitHub",
    category: "Source control & CI",
    description: "Repository hosting, PRs, and CI workflows.",
    websiteUrl: "https://github.com",
    docsUrl: "https://docs.github.com",
    mcpUrl: null,
  },
  {
    name: "Depot",
    category: "Source control & CI",
    description: "Faster GitHub Actions runners + cache for CI builds (see docs/ci-depot.md).",
    websiteUrl: "https://depot.dev",
    docsUrl: "https://depot.dev/docs/github-actions/quickstart",
    mcpUrl: null,
  },
  {
    name: "Tailwind CSS",
    category: "UI",
    description: "Utility-first styling across the app.",
    websiteUrl: "https://tailwindcss.com",
    docsUrl: "https://tailwindcss.com/docs",
    mcpUrl: null,
  },
  {
    name: "Docker",
    category: "Local development",
    description: "Optional local Postgres and tooling via Compose.",
    websiteUrl: "https://www.docker.com",
    docsUrl: "https://docs.docker.com",
    mcpUrl: null,
  },
  {
    name: "Cursor",
    category: "Development (IDE)",
    description: "AI-assisted development; MCP client configuration.",
    websiteUrl: "https://cursor.com",
    docsUrl: "https://cursor.com/docs",
    mcpUrl: "https://cursor.com/docs/context/mcp",
  },
  {
    name: "Model Context Protocol",
    category: "AI integrations",
    description: "Open standard for connecting LLM hosts to tools (reference).",
    websiteUrl: "https://modelcontextprotocol.io",
    docsUrl: "https://modelcontextprotocol.io/docs/getting-started/intro",
    mcpUrl: "https://modelcontextprotocol.io/docs/getting-started/intro",
  },
].sort((a, b) => {
  const c = a.category.localeCompare(b.category);
  return c !== 0 ? c : a.name.localeCompare(b.name);
});

export const MCP_OVERVIEW_URL = "https://modelcontextprotocol.io";
