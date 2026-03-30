import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canManageDeals } from "@/lib/deal-roles";
import { CsvDealImportClient } from "@/components/CsvDealImportClient";

export const metadata = { title: "Import deals (CSV) — Modular Equity" };

export default async function ImportDealsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (!canManageDeals(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <Link href="/dashboard/team" className="text-sm text-muted hover:text-accent">
          ← Deal sourcing hub
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Import deals from CSV
        </h1>
        <p className="mt-2 text-muted">
          Upload a spreadsheet export — one row per deal. Required columns include{" "}
          <code className="rounded bg-background px-1">name</code>,{" "}
          <code className="rounded bg-background px-1">propertyUrl</code>, and all
          numeric financial fields. Aliases like{" "}
          <code className="rounded bg-background px-1">deal_name</code>,{" "}
          <code className="rounded bg-background px-1">listing_url</code>,{" "}
          <code className="rounded bg-background px-1">total_cost</code> are accepted.
        </p>
      </div>

      <CsvDealImportClient />

      <section className="rounded-xl border border-border bg-card p-6 text-sm text-muted">
        <h2 className="font-medium text-foreground">Example header row</h2>
        <pre className="mt-3 overflow-x-auto rounded bg-background p-3 text-xs">
{`name,propertyUrl,city,state,summary,purchaseUsd,saleUsd,holdPeriodMonths,debtRatePct,renoBudgetUsd,transactionFeesUsd,totalCostUsd,profitUsd,moneyToCloseUsd,moneyToRenoUsd`}
        </pre>
      </section>
    </div>
  );
}
