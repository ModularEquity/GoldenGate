"use client";

import { useId, useState } from "react";
import type { TechCatalogueItem } from "@/lib/technical-catalogue";
import { MCP_OVERVIEW_URL } from "@/lib/technical-catalogue";

type Props = {
  items: TechCatalogueItem[];
};

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className="text-muted transition-transform"
      aria-hidden
      style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
    >
      ▸
    </span>
  );
}

export function TechnicalCatalogueAccordions({ items }: Props) {
  const baseId = useId();
  const [diagramOpen, setDiagramOpen] = useState(true);
  const [toolsOpen, setToolsOpen] = useState(false);

  const diagramPanelId = `${baseId}-diagram-panel`;
  const diagramBtnId = `${baseId}-diagram-btn`;
  const toolsPanelId = `${baseId}-tools-panel`;
  const toolsBtnId = `${baseId}-tools-btn`;

  return (
    <div className="space-y-4">
      {/* 1 · Technical diagram — default expanded */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <h2 className="sr-only">Technical architecture</h2>
        <button
          id={diagramBtnId}
          type="button"
          aria-expanded={diagramOpen}
          aria-controls={diagramPanelId}
          onClick={() => setDiagramOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-6"
        >
          <span className="text-base font-semibold text-foreground">
            Technical diagram of our systems setup
          </span>
          <Chevron open={diagramOpen} />
        </button>
        {diagramOpen ? (
          <div
            id={diagramPanelId}
            role="region"
            aria-labelledby={diagramBtnId}
            className="border-t border-border px-4 pb-6 pt-2 sm:px-6"
          >
            <p className="text-sm leading-relaxed text-muted">
              Modular Equity generates investor returns through{" "}
              <strong className="text-foreground">real estate deals</strong> (underwriting,
              renovation, exit). The platform you use is built on the stack below so we can
              onboard compliantly, show deal economics, and process subscriptions and funding
              requests — with{" "}
              <strong className="text-foreground">transparent handling of credentials</strong>.
            </p>

            <div className="mt-6 space-y-3 rounded-lg border border-accent/30 bg-accent/5 p-4 text-sm">
              <p className="font-medium text-foreground">High-level data flow</p>
              <div className="font-mono text-xs leading-relaxed text-muted sm:text-sm">
                <div className="rounded border border-border bg-background/80 px-3 py-2 text-center text-foreground">
                  Investor (browser)
                </div>
                <div className="py-1 text-center text-accent">▼ HTTPS</div>
                <div className="rounded border border-border bg-background/80 px-3 py-2 text-center text-foreground">
                  Vercel — Next.js app (App Router, API routes)
                </div>
                <div className="py-1 text-center text-accent">▼ TLS</div>
                <div className="rounded border border-border bg-background/80 px-3 py-2 text-center text-foreground">
                  Neon — PostgreSQL (users, deals, subscriptions, audit trail)
                </div>
                <div className="py-1 text-center text-accent">▼ API calls (server-only)</div>
                <div className="rounded border border-dashed border-border bg-muted/40 px-3 py-2 text-center">
                  Google OAuth · Resend · Stripe / Plaid (as configured)
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-semibold text-foreground">
                Where secrets &amp; API keys live
              </h3>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
                <li>
                  <strong className="text-foreground">Vercel (Production / Preview)</strong>{" "}
                  — Environment variables store{" "}
                  <code className="rounded bg-background px-1">AUTH_SECRET</code>, database
                  URLs, <code className="rounded bg-background px-1">AUTH_GOOGLE_*</code>,{" "}
                  <code className="rounded bg-background px-1">RESEND_API_KEY</code>, payment
                  provider keys, etc. They are{" "}
                  <strong className="text-foreground">not</strong> in the Git repository.
                </li>
                <li>
                  <strong className="text-foreground">Client-visible names only</strong> — Any
                  variable prefixed with{" "}
                  <code className="rounded bg-background px-1">NEXT_PUBLIC_</code> is embedded
                  in the browser bundle (e.g. public app URL). We keep those minimal.
                </li>
                <li>
                  <strong className="text-foreground">Sessions</strong> — Signed on the server
                  with <code className="rounded bg-background px-1">AUTH_SECRET</code>; the
                  secret never ships to the client.
                </li>
                <li>
                  <strong className="text-foreground">Local development</strong> — Secrets in
                  your machine&apos;s <code className="rounded bg-background px-1">.env</code>{" "}
                  (see <code className="rounded bg-background px-1">.env.example</code> for
                  names only — no real values in git).
                </li>
              </ul>
            </div>

            <p className="mt-4 text-xs text-muted">
              This infrastructure exists to{" "}
              <strong className="text-foreground">
                deploy capital into renovation projects and report back
              </strong>{" "}
              — not to obscure how your data moves. If a vendor or key changes, we update the
              catalogue and deployment config accordingly.
            </p>
          </div>
        ) : null}
      </section>

      {/* 2 · Tools table — default collapsed */}
      <section className="rounded-xl border border-border bg-card shadow-sm">
        <button
          id={toolsBtnId}
          type="button"
          aria-expanded={toolsOpen}
          aria-controls={toolsPanelId}
          onClick={() => setToolsOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left sm:px-6"
        >
          <span className="text-base font-semibold text-foreground">Tools</span>
          <Chevron open={toolsOpen} />
        </button>
        {toolsOpen ? (
          <div
            id={toolsPanelId}
            role="region"
            aria-labelledby={toolsBtnId}
            className="border-t border-border"
          >
            <div className="overflow-x-auto">
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
                  {items.map((row) => (
                    <tr
                      key={row.name}
                      className="border-b border-border/80 last:border-0 hover:bg-background/40"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{row.name}</td>
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
            <div className="border-t border-border bg-card/80 px-4 py-4 sm:px-6">
              <p className="text-xs text-muted">
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
          </div>
        ) : null}
      </section>
    </div>
  );
}
