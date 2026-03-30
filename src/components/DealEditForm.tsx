"use client";

import type { DealDetail } from "@/lib/deals";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function dateInput(d: Date | null) {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

export function DealEditForm({ deal }: { deal: DealDetail }) {
  const router = useRouter();
  const initial = useMemo(
    () => ({
      name: deal.name,
      slug: deal.slug,
      city: deal.city,
      state: deal.state,
      summary: deal.summary,
      highlights: deal.highlights.join("\n"),
      propertyUrl: deal.propertyUrl,
      status: deal.status,
      purchaseUsd: String(deal.purchaseUsd),
      saleUsd: String(deal.saleUsd),
      holdPeriodMonths: String(deal.holdPeriodMonths),
      debtRatePct: String(deal.debtRatePct),
      renoBudgetUsd: String(deal.renoBudgetUsd),
      transactionFeesUsd: String(deal.transactionFeesUsd),
      totalCostUsd: String(deal.totalCostUsd),
      profitUsd: String(deal.profitUsd),
      moneyToCloseUsd: String(deal.moneyToCloseUsd),
      closeDate: dateInput(deal.closeDate),
      moneyToRenoUsd: String(deal.moneyToRenoUsd),
      maxSubscriptionPctOfTotalCost: String(deal.maxSubscriptionPctOfTotalCost),
      ltvPct: String(deal.ltvPct),
      renovationCompleteDate: dateInput(deal.renovationCompleteDate),
      listingDate: dateInput(deal.listingDate),
      saleTargetDate: dateInput(deal.saleTargetDate),
      gpContributionUsd: String(deal.gpContributionUsd),
    }),
    [deal],
  );

  const [f, setF] = useState(initial);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof typeof f>(key: K, v: (typeof f)[K]) {
    setF((prev) => ({ ...prev, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${deal.slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: f.name,
          slug: f.slug || undefined,
          city: f.city,
          state: f.state,
          summary: f.summary,
          highlights: f.highlights,
          propertyUrl: f.propertyUrl,
          status: f.status,
          purchaseUsd: f.purchaseUsd,
          saleUsd: f.saleUsd,
          holdPeriodMonths: f.holdPeriodMonths,
          debtRatePct: f.debtRatePct,
          renoBudgetUsd: f.renoBudgetUsd,
          transactionFeesUsd: f.transactionFeesUsd,
          totalCostUsd: f.totalCostUsd,
          profitUsd: f.profitUsd,
          moneyToCloseUsd: f.moneyToCloseUsd,
          closeDate: f.closeDate || undefined,
          moneyToRenoUsd: f.moneyToRenoUsd,
          maxSubscriptionPctOfTotalCost: f.maxSubscriptionPctOfTotalCost
            ? Number(f.maxSubscriptionPctOfTotalCost)
            : undefined,
          ltvPct: f.ltvPct ? Number(f.ltvPct) : undefined,
          renovationCompleteDate: f.renovationCompleteDate || undefined,
          listingDate: f.listingDate || undefined,
          saleTargetDate: f.saleTargetDate || undefined,
          gpContributionUsd: f.gpContributionUsd
            ? Number(f.gpContributionUsd.replace(/[^0-9.-]/g, ""))
            : undefined,
          propertyUrlChanged: f.propertyUrl !== deal.propertyUrl,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr(data.error ?? "Could not save");
        return;
      }
      router.refresh();
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Deal name *</label>
          <input
            required
            value={f.name}
            onChange={(e) => set("name", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">URL slug</label>
          <input
            value={f.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            value={f.status}
            onChange={(e) =>
              set("status", e.target.value as typeof f.status)
            }
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="OPEN">Open</option>
            <option value="CLOSING">Closing</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">City *</label>
          <input
            required
            value={f.city}
            onChange={(e) => set("city", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">State *</label>
          <input
            required
            value={f.state}
            onChange={(e) => set("state", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            maxLength={2}
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Property listing URL *</label>
          <input
            required
            type="url"
            value={f.propertyUrl}
            onChange={(e) => set("propertyUrl", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Summary *</label>
          <textarea
            required
            rows={3}
            value={f.summary}
            onChange={(e) => set("summary", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Highlights (one per line)</label>
          <textarea
            rows={4}
            value={f.highlights}
            onChange={(e) => set("highlights", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Field label="Purchase ($) *" v={f.purchaseUsd} onChange={(v) => set("purchaseUsd", v)} />
        <Field label="Sale / exit ($) *" v={f.saleUsd} onChange={(v) => set("saleUsd", v)} />
        <Field label="Hold period (months) *" v={f.holdPeriodMonths} onChange={(v) => set("holdPeriodMonths", v)} />
        <Field label="Debt rate % *" v={f.debtRatePct} onChange={(v) => set("debtRatePct", v)} />
        <Field label="Reno budget ($) *" v={f.renoBudgetUsd} onChange={(v) => set("renoBudgetUsd", v)} />
        <Field label="Transaction fees ($) *" v={f.transactionFeesUsd} onChange={(v) => set("transactionFeesUsd", v)} />
        <Field label="Total cost ($) *" v={f.totalCostUsd} onChange={(v) => set("totalCostUsd", v)} />
        <Field label="Profit ($) *" v={f.profitUsd} onChange={(v) => set("profitUsd", v)} />
        <Field label="Money to close ($) *" v={f.moneyToCloseUsd} onChange={(v) => set("moneyToCloseUsd", v)} />
        <Field label="Money to reno ($) *" v={f.moneyToRenoUsd} onChange={(v) => set("moneyToRenoUsd", v)} />
        <div className="space-y-2">
          <label className="text-sm font-medium">Close date</label>
          <input
            type="date"
            value={f.closeDate}
            onChange={(e) => set("closeDate", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Max subscription (% of total cost)</label>
          <input
            value={f.maxSubscriptionPctOfTotalCost}
            onChange={(e) => set("maxSubscriptionPctOfTotalCost", e.target.value)}
            inputMode="numeric"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">LTV vs total cost (%)</label>
          <input
            value={f.ltvPct}
            onChange={(e) => set("ltvPct", e.target.value)}
            inputMode="numeric"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">GP participation ($)</label>
          <input
            value={f.gpContributionUsd}
            onChange={(e) => set("gpContributionUsd", e.target.value)}
            inputMode="decimal"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Target reno complete</label>
          <input
            type="date"
            value={f.renovationCompleteDate}
            onChange={(e) => set("renovationCompleteDate", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Target listing date</label>
          <input
            type="date"
            value={f.listingDate}
            onChange={(e) => set("listingDate", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Target sale date</label>
          <input
            type="date"
            value={f.saleTargetDate}
            onChange={(e) => set("saleTargetDate", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
        </div>
      </div>

      {err ? <p className="text-sm text-red-500">{err}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}

function Field({
  label,
  v,
  onChange,
}: {
  label: string;
  v: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      <input
        required
        value={v}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
