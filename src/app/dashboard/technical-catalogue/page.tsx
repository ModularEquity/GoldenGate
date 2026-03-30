import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  MCP_OVERVIEW_URL,
  TECHNICAL_CATALOGUE,
} from "@/lib/technical-catalogue";

export const metadata = {
  title: "Technical catalogue — Modular Equity",
  description:
    "Infrastructure, vendors, and documentation links for Modular Equity.",
};

export default async function TechnicalCataloguePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-accent"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
          Technical catalogue
        </h1>
        <p className="mt-3 max-w-3xl text-muted">
          Internal reference for our stack: hosting, data, auth, integrations, and
          where to read vendor docs — including{" "}
          <strong className="text-foreground">Model Context Protocol (MCP)</strong>{" "}
          resources per tool when available. Mirrors the spirit of the public{" "}
          <Link href="/" className="text-accent hover:underline">
            integration partners
          </Link>{" "}
          strip on the home page, with full detail for members.
        </p>
        <p className="mt-2 text-sm text-muted">
          MCP overview:{" "}
          <a
            href={MCP_OVERVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            modelcontextprotocol.io ↗
          </a>
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-background/80">
              <th className="px-4 py-3 font-semibold text-foreground">Tool</th>
              <th className="px-4 py-3 font-semibold text-foreground">Category</th>
              <th className="px-4 py-3 font-semibold text-foreground">Role</th>
              <th className="px-4 py-3 font-semibold text-foreground">Website</th>
              <th className="px-4 py-3 font-semibold text-foreground">
                Developer docs
              </th>
              <th className="px-4 py-3 font-semibold text-foreground">MCP docs</th>
            </tr>
          </thead>
          <tbody>
            {TECHNICAL_CATALOGUE.map((row) => (
              <tr
                key={row.name}
                className="border-b border-border/80 last:border-0 hover:bg-background/40"
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  {row.name}
                </td>
                <td className="px-4 py-3 text-muted">{row.category}</td>
                <td className="max-w-xs px-4 py-3 text-muted">{row.description}</td>
                <td className="px-4 py-3">
                  <a
                    href={row.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Home ↗
                  </a>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={row.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                    title={row.docsUrl}
                  >
                    Docs ↗
                  </a>
                </td>
                <td className="px-4 py-3">
                  {row.mcpUrl ? (
                    <a
                      href={row.mcpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:underline"
                      title={row.mcpUrl}
                    >
                      MCP ↗
                    </a>
                  ) : (
                    <span className="text-muted" title="No vendor MCP page">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="rounded-xl border border-dashed border-border bg-card/80 p-6">
        <h2 className="font-medium text-foreground">Notes</h2>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
          <li>
            Production database is <strong className="text-foreground">Neon</strong>{" "}
            Postgres; <strong className="text-foreground">Supabase</strong> is listed
            for reference and MCP patterns, not as our primary host unless we migrate.
          </li>
          <li>
            When a tool has no dedicated MCP page, use the{" "}
            <a
              href={MCP_OVERVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              MCP specification
            </a>{" "}
            and your IDE&apos;s MCP client docs (e.g. Cursor).
          </li>
        </ul>
      </section>
    </div>
  );
}
