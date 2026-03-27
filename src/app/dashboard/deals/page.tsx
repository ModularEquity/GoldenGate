import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { INVESTOR_GOOGLE_DOCS } from "@/lib/investor-resources";
import { DEALS } from "@/lib/deals";

export const metadata = {
  title: "Deals — Modular Equity",
};

export default async function DealsPage() {
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
          Deal room
        </h1>
        <p className="mt-2 text-muted">
          Review fix-and-flip and renovation opportunities. Shared diligence
          lives in the{" "}
          <a
            href={INVESTOR_GOOGLE_DOCS.dealRoomFolder}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Deal room Google Drive folder ↗
          </a>
          .
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {DEALS.map((deal) => (
          <Link
            key={deal.slug}
            href={`/dashboard/deals/${deal.slug}`}
            className="group rounded-xl border border-border bg-card p-6 transition hover:border-accent/50 hover:shadow-md"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              {deal.status}
            </p>
            <h2 className="mt-2 font-semibold text-foreground group-hover:text-accent">
              {deal.name}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {deal.city}, {deal.state}
            </p>
            <p className="mt-3 line-clamp-3 text-sm text-muted leading-relaxed">
              {deal.summary}
            </p>
            <span className="mt-4 inline-flex text-sm font-medium text-accent">
              Open deal →
            </span>
          </Link>
        ))}
        <div className="rounded-xl border border-dashed border-border bg-card/80 p-6">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Pipeline
          </p>
          <h2 className="mt-2 font-semibold text-foreground">More deals</h2>
          <p className="mt-2 text-sm text-muted">
            Additional opportunities will appear here as they open.
          </p>
        </div>
      </div>
    </div>
  );
}
