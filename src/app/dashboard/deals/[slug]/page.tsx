import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { toDealDetail } from "@/lib/deals";
import { RefreshDealThumbnail } from "@/components/RefreshDealThumbnail";

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

  const deal = toDealDetail(row);
  const statusLabel =
    deal.status === "OPEN"
      ? "Open"
      : deal.status === "CLOSING"
        ? "Closing"
        : "Closed";

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
        {row.status === "OPEN" && session.user.role !== "EMPLOYEE" ? (
          <Link
            href={`/dashboard/subscribe/${deal.slug}`}
            className="inline-flex w-fit items-center rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Subscribe to this deal →
          </Link>
        ) : null}
        {session.user.role === "EMPLOYEE" ? (
          <RefreshDealThumbnail slug={deal.slug} />
        ) : null}
      </div>

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
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Fin label="Purchase" value={fmtUsd(deal.purchaseUsd)} />
          <Fin label="Sale (exit)" value={fmtUsd(deal.saleUsd)} />
          <Fin label="Hold period" value={`${deal.holdPeriodMonths} months`} />
          <Fin
            label="Debt financing"
            value={`${deal.debtRatePct.toFixed(2).replace(/\.?0+$/, "")}%`}
          />
          <Fin label="Reno budget" value={fmtUsd(deal.renoBudgetUsd)} />
          <Fin label="Transaction fees" value={fmtUsd(deal.transactionFeesUsd)} />
          <Fin label="Total cost" value={fmtUsd(deal.totalCostUsd)} />
          <Fin label="Profit" value={fmtUsd(deal.profitUsd)} />
          <Fin label="Money to close" value={fmtUsd(deal.moneyToCloseUsd)} />
          <Fin label="Money to reno" value={fmtUsd(deal.moneyToRenoUsd)} />
          <Fin
            label="Target close date"
            value={
              deal.closeDate
                ? deal.closeDate.toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })
                : "—"
            }
          />
        </dl>
      </section>

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

function Fin({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/80 bg-background/50 p-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-lg font-semibold text-foreground">{value}</dd>
    </div>
  );
}
