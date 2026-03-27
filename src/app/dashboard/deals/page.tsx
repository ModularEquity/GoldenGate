import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { INVESTOR_GOOGLE_DOCS } from "@/lib/investor-resources";
import { toDealListItem } from "@/lib/deals";
import { DealCard } from "@/components/DealCard";

export const metadata = {
  title: "Deals — Modular Equity",
};

export default async function DealsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const rows = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
  });
  const deals = rows.map(toDealListItem);

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
        {session.user.role === "EMPLOYEE" ? (
          <p className="mt-3">
            <Link
              href="/dashboard/team/deals/new"
              className="text-sm font-medium text-accent hover:underline"
            >
              Add a new deal (team) →
            </Link>
          </p>
        ) : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>

      {deals.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
          No deals yet. Employees can add deals from Team → Add deal.
        </p>
      ) : null}
    </div>
  );
}
