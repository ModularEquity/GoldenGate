import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-session";

export const metadata = {
  title: "Deals — GoldenGate",
};

export default async function DealsPage() {
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
          Deal room
        </h1>
        <p className="mt-2 text-muted">
          Fix-and-flip and renovation opportunities — review materials before
          subscribing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[
          {
            title: "Sample renovation — Austin, TX",
            status: "Open for review",
            detail: "Underwriting summary, renovation budget, exit comps — placeholder.",
          },
          {
            title: "Pipeline",
            status: "Coming soon",
            detail: "Additional deals will list here as they open.",
          },
        ].map((deal) => (
          <div
            key={deal.title}
            className="rounded-xl border border-border bg-card p-6"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              {deal.status}
            </p>
            <h2 className="mt-2 font-semibold text-foreground">{deal.title}</h2>
            <p className="mt-2 text-sm text-muted">{deal.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
