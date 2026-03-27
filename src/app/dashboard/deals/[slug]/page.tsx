import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDealBySlug } from "@/lib/deals";

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
  const deal = getDealBySlug(slug);
  return {
    title: deal ? `${deal.name} — Modular Equity` : "Deal — Modular Equity",
  };
}

export default async function DealDetailPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { slug } = await params;
  const deal = getDealBySlug(slug);
  if (!deal) notFound();

  const { financials: f } = deal;

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/dashboard/deals"
          className="text-sm text-muted hover:text-accent"
        >
          ← Deal room
        </Link>
        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">
          {deal.status}
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

      <a
        href={deal.redfinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border-2 border-red-600 bg-red-600/10 px-5 py-3 text-sm font-semibold text-red-800 transition hover:bg-red-600/20 dark:text-red-200"
      >
        View property on Redfin ↗
      </a>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Highlights</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-muted">
          {deal.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">
          Underwriting summary
        </h2>
        <p className="mt-2 text-xs text-muted">
          Illustrative only — subject to diligence, appraisal, and final approval.
        </p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border/80 bg-background/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Purchase price
            </dt>
            <dd className="mt-1 text-xl font-semibold text-foreground">
              {fmtUsd(f.purchasePriceUsd)}
            </dd>
          </div>
          <div className="rounded-lg border border-border/80 bg-background/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Rehab budget
            </dt>
            <dd className="mt-1 text-xl font-semibold text-foreground">
              {fmtUsd(f.rehabBudgetUsd)}
            </dd>
          </div>
          <div className="rounded-lg border border-border/80 bg-background/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              After repair value (ARV)
            </dt>
            <dd className="mt-1 text-xl font-semibold text-foreground">
              {fmtUsd(f.arvUsd)}
            </dd>
          </div>
          <div className="rounded-lg border border-border/80 bg-background/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Projected equity multiple
            </dt>
            <dd className="mt-1 text-xl font-semibold text-foreground">
              {f.projectedEquityMultiple}
            </dd>
          </div>
          <div className="rounded-lg border border-border/80 bg-background/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Projected IRR (range)
            </dt>
            <dd className="mt-1 text-xl font-semibold text-foreground">
              {f.projectedIrrPct}
            </dd>
          </div>
          <div className="rounded-lg border border-border/80 bg-background/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Target hold
            </dt>
            <dd className="mt-1 text-xl font-semibold text-foreground">
              {f.holdPeriodMonths} months
            </dd>
          </div>
          <div className="rounded-lg border border-border/80 bg-background/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Minimum investment
            </dt>
            <dd className="mt-1 text-xl font-semibold text-foreground">
              {fmtUsd(f.minInvestmentUsd)}
            </dd>
          </div>
          <div className="rounded-lg border border-border/80 bg-background/50 p-4">
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">
              Total raise (target)
            </dt>
            <dd className="mt-1 text-xl font-semibold text-foreground">
              {fmtUsd(f.totalRaiseUsd)}
            </dd>
          </div>
        </dl>
        {f.notes ? (
          <p className="mt-6 text-sm text-muted">{f.notes}</p>
        ) : null}
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
