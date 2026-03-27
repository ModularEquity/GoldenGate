"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const empty = {
  name: "",
  slug: "",
  city: "",
  state: "",
  summary: "",
  highlights: "",
  propertyUrl: "",
  status: "OPEN" as "OPEN" | "CLOSING" | "CLOSED",
  purchaseUsd: "",
  saleUsd: "",
  holdPeriodMonths: "",
  debtRatePct: "",
  renoBudgetUsd: "",
  transactionFeesUsd: "",
  totalCostUsd: "",
  profitUsd: "",
  moneyToCloseUsd: "",
  closeDate: "",
  moneyToRenoUsd: "",
  maxSubscriptionPctOfTotalCost: "20",
};

export function DealForm() {
  const router = useRouter();
  const [f, setF] = useState(empty);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function set<K extends keyof typeof empty>(key: K, v: (typeof empty)[K]) {
    setF((prev) => ({ ...prev, [key]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/deals", {
        method: "POST",
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
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; deal?: { slug: string } };
      if (!res.ok || !data.ok || !data.deal) {
        setErr(data.error ?? "Could not create deal");
        return;
      }
      router.push(`/dashboard/deals/${data.deal.slug}`);
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
            placeholder="2915 Umberland Dr — Atlanta"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">URL slug (optional)</label>
          <input
            value={f.slug}
            onChange={(e) => set("slug", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="auto from name"
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
            placeholder="https://www.redfin.com/..."
          />
          <p className="text-xs text-muted">
            Thumbnail is pulled from the page’s Open Graph image (e.g. Redfin hero photo).
          </p>
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
          <label className="text-sm font-medium">
            Max subscription (% of total cost)
          </label>
          <input
            value={f.maxSubscriptionPctOfTotalCost}
            onChange={(e) =>
              set("maxSubscriptionPctOfTotalCost", e.target.value)
            }
            inputMode="numeric"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="20"
          />
          <p className="text-xs text-muted">
            Investor cap per deal = this % × total cost (min $5,000).
          </p>
        </div>
      </div>

      {err ? <p className="text-sm text-red-500">{err}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Create deal & fetch thumbnail"}
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
