import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { toDealListItem } from "@/lib/deals";
import { SubscribeDealsTable } from "@/components/SubscribeDealsTable";

export const metadata = {
  title: "Subscribe — Modular Equity",
};

export default async function SubscribePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const rows = await prisma.deal.findMany({
    where: { status: "OPEN" },
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
          Subscribe to a deal
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Select an open deal, then enter your subscription amount. Minimum is{" "}
          <strong className="text-foreground">$5,000</strong> per deal. Maximum
          is a percentage of total project cost (shown per deal — e.g. Umberland
          caps at <strong className="text-foreground">20%</strong> of total
          cost). Definitive subscription documents (DocSign) will follow.
        </p>
      </div>

      <SubscribeDealsTable deals={deals} />

      <p className="text-center text-xs text-muted">
        Not an offer to sell securities where prohibited. Information is
        illustrative; rely on definitive documents.
      </p>
    </div>
  );
}
