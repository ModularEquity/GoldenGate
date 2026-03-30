import type { ReactNode } from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { toDealDetail } from "@/lib/deals";
import { RefreshDealThumbnail } from "@/components/RefreshDealThumbnail";
import { fetchOgImageUrl } from "@/lib/og-image";
import { computeDealReturnMetrics, formatPct } from "@/lib/deal-metrics";
import { computeEquityCapacity } from "@/lib/deal-equity-capacity";
import { DealInvestmentCalculator } from "@/components/DealInvestmentCalculator";
import { EquityCapacityBar } from "@/components/EquityCapacityBar";
import { canManageDeals } from "@/lib/deal-roles";
import { DealEditForm } from "@/components/DealEditForm";
import { DealAuditSection } from "@/components/DealAuditSection";
import { DealCommentsSection } from "@/components/DealCommentsSection";

type Props = { params: Promise<{ slug: string }> };

function fmtUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const row = await prisma.deal.findUnique({ where: { slug } });
  return {
    title: row ? `${row.name} — Modular Equity` : "Deal — Modular Equity",
  };
}

export default async function DealDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { slug } = await params;
  const row = await prisma.deal.findUnique({ where: { slug } });
  if (!row) notFound();

  let thumbnailUrl = row.thumbnailUrl;
  if (!thumbnailUrl && row.propertyUrl) {
    const fetched = await fetchOgImageUrl(row.propertyUrl);
    if (fetched) {
      await prisma.deal.update({
        where: { id: row.id },
        data: { thumbnailUrl: fetched },
      });
      thumbnailUrl = fetched;
    }
  }

  const deal = toDealDetail({ ...row, thumbnailUrl });

  const subsAgg = await prisma.dealSubscription.aggregate({
    where: { dealId: row.id },
    _sum: { amountCents: true },
  });
  const lpSubscribedUsd = (subsAgg._sum.amountCents ?? 0) / 100;
  const equityBreakdown = computeEquityCapacity(
    deal.totalCostUsd,
    deal.ltvPct,
    deal.gpContributionUsd,
    lpSubscribedUsd,
  );

  const returns = computeDealReturnMetrics(
    deal.profitUsd,
    deal.totalCostUsd,
    deal.holdPeriodMonths,
    deal.ltvPct,
  );

  function fmtDate(d: Date | null) {
    if (!d) return "—";
    return d.toLocaleDateString("en-US", {
      month: "numeric",
      day: "numeric",
      year: "numeric",
    });
  }
  const statusLabel =
    deal.status === "OPEN"
      ? "Open"
      : deal.status === "CLOSING"
        ? "Closing"
        : "Closed";

  const canEdit = canManageDeals(session.user.role);
  const showSubscribe = deal.status === "OPEN" && session.user.role === "INVESTOR";
  const canRefreshThumb =
    session.user.role === "EMPLOYEE" || session.user.role === "DEAL_SOURCER";

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <Link
            href="/dashboard/deals"
            className="text-sm text-muted hover:text-accent"
          >
            ← Deal room
          </Link>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">
            {statusLabel}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
            {deal.name}
          </h1>
          <p className="mt-2 text-muted">
            {deal.city}, {deal.state}
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted">
            {deal.summary}
          </p>
        </div>
        {deal.thumbnailUrl ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={deal.thumbnailUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
        <a
          href={deal.propertyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-lg border-2 border-red-600 bg-red-600/10 px-5 py-3 text-sm font-semibold text-red-800 transition hover:bg-red-600/20 dark:text-red-200"
        >
          View on Redfin ↗
        </a>
        {showSubscribe ? (
          <Link
            href={`/dashboard/subscribe/${deal.slug}`}
            className="inline-flex w-fit items-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Subscribe to this deal →
          </Link>
        ) : null}
        {canRefreshThumb ? (
          <RefreshDealThumbnail slug={deal.slug} />
        ) : null}
      </div>

      {canEdit ? (
        <section className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-6">
          <h2 className="text-lg font-semibold text-foreground">
            Edit deal (Deal Sourcer / operations)
          </h2>
          <p className="mt-2 text-sm text-muted">
            Changes are saved to the database and recorded in the change history below
            with your user and timestamp.
          </p>
          <div className="mt-4">
            <DealEditForm deal={deal} />
          </div>
        </section>
      ) : null}

      {deal.highlights.length > 0 ? (
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">Highlights</h2>
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
            {deal.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Deal financials
        </h2>
        <p className="mt-2 text-xs text-muted">
          For discussion only — subject to diligence and definitive documents.
          Unlevered metrics use total cost; levered ROE assumes{" "}
          <strong>{deal.ltvPct}%</strong> LTV (debt vs total cost),{" "}
          <strong>{100 - deal.ltvPct}%</strong> equity.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Fin label="Purchase" value={fmtUsd(deal.purchaseUsd)} />
          <Fin label="Sale (exit)" value={fmtUsd(deal.saleUsd)} />
          <Fin label="Hold period" value={`${deal.holdPeriodMonths} months`} />
          <Fin
            label="Debt financing (rate)"
            value={`${deal.debtRatePct.toFixed(2).replace(/\.?0+$/, "")}%`}
          />
          <Fin
            label="LTV vs total cost"
            value={`${deal.ltvPct}% / ${100 - deal.ltvPct}% equity`}
          />
          <Fin
            label="GP participation (committed)"
            value={fmtUsd(deal.gpContributionUsd)}
          />
          <Fin label="Reno budget" value={fmtUsd(deal.renoBudgetUsd)} />
          <Fin label="Transaction fees" value={fmtUsd(deal.transactionFeesUsd)} />
          <Fin label="Total cost" value={fmtUsd(deal.totalCostUsd)} />
          <Fin label="Profit" value={fmtUsd(deal.profitUsd)} />
          <Fin
            label="% Return — unlevered (profit / total cost)"
            value={formatPct(returns.unleveredReturnPct, 2)}
          />
          <Fin
            label="Annualized IRR — unlevered"
            value={
              <span className="italic">
                {formatPct(returns.annualizedUnleveredIrrPct, 2)}
              </span>
            }
          />
          <Fin
            label="Levered (actual) ROE — profit / equity"
            value={formatPct(returns.leveredRoePct, 2)}
          />
          <Fin
            label="Annualized levered IRR (on equity)"
            value={
              <span className="italic">
                {formatPct(returns.annualizedLeveredIrrPct, 2)}
              </span>
            }
          />
          <Fin label="Money to close" value={fmtUsd(deal.moneyToCloseUsd)} />
          <Fin label="Money to reno" value={fmtUsd(deal.moneyToRenoUsd)} />
          <Fin label="Target acquisition close" value={fmtDate(deal.closeDate)} />
          <Fin
            label="Target renovation complete"
            value={fmtDate(deal.renovationCompleteDate)}
          />
          <Fin label="Target listing date" value={fmtDate(deal.listingDate)} />
          <Fin label="Target sale date" value={fmtDate(deal.saleTargetDate)} />
        </dl>
      </section>

      <EquityCapacityBar dealName={deal.name} breakdown={equityBreakdown} />

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Documents</h2>
        <p className="mt-2 text-sm text-muted">
          Contractor scope & estimate — placeholder PDF until the signed GC
          package is uploaded.
        </p>
        <a
          href={`/api/deals/${deal.slug}/contractor-scope`}
          className="mt-4 inline-flex rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-accent hover:bg-accent/5"
        >
          Download contractor scope (placeholder PDF) ↓
        </a>
      </section>

      <DealInvestmentCalculator
        totalCostUsd={deal.totalCostUsd}
        profitUsd={deal.profitUsd}
        ltvPct={deal.ltvPct}
      />

      <DealAuditSection dealSlug={deal.slug} />

      <DealCommentsSection dealSlug={deal.slug} />

      <section className="rounded-xl border border-dashed border-border bg-card/80 p-6">
        <h2 className="font-medium text-foreground">Next steps</h2>
        <p className="mt-2 text-sm text-muted">
          Review the{" "}
          <Link href="/dashboard/subscribe" className="text-accent hover:underline">
            subscription
          </Link>{" "}
          flow and{" "}
          <Link href="/dashboard/fund" className="text-accent hover:underline">
            funding
          </Link>{" "}
          when ready. Questions? See{" "}
          <Link href="/dashboard/faq" className="text-accent hover:underline">
            FAQ
          </Link>
          .
        </p>
      </section>
    </div>
  );
}

function Fin({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/80 bg-background/50 p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
    </div>
  );
}
