import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-session";

export const metadata = {
  title: "Documents — GoldenGate",
};

export default async function DocumentsPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/login");

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
          Read-only document vault — placeholder for PDF / DocSign viewer.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted">
        Operating agreement and related fund documents will appear here.
      </div>

      <div
        id="cap-table"
        className="scroll-mt-24 space-y-2 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-medium text-foreground">Cap table</h2>
        <p className="text-sm text-muted">
          Read-only position summary — placeholder until cap table data is
          connected.
        </p>
      </div>
    </div>
  );
}
