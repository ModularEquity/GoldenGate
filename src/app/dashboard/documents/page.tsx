import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { INVESTOR_GOOGLE_DOCS } from "@/lib/investor-resources";

export const metadata = {
  title: "Documents — Modular Equity",
};

export default async function DocumentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-accent"
        >
          ← Investor hub
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Operating documents
        </h1>
        <p className="mt-2 text-muted">
          Read-only references. Primary source remains signed PDFs and DocSign
          packages.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-medium text-foreground">Operating agreement (PDF)</h2>
        <p className="mt-2 text-sm text-muted">
          <a
            href={INVESTOR_GOOGLE_DOCS.operatingDoc}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Open in Google Drive ↗
          </a>
        </p>
      </div>

      <div
        id="cap-table"
        className="scroll-mt-24 space-y-2 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-medium text-foreground">Cap table</h2>
        <p className="text-sm text-muted">
          Read-only position summary — connect cap table data source in a future
          release. For deal materials, see the{" "}
          <a
            href={INVESTOR_GOOGLE_DOCS.dealRoomFolder}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Deal room folder ↗
          </a>
          .
        </p>
      </div>
    </div>
  );
}
