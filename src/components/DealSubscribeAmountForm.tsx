"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { DealListItem } from "@/lib/deals";
import {
  MIN_SUBSCRIPTION_USD,
  maxSubscriptionUsd,
} from "@/lib/subscription-rules";

function fmtUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function DealSubscribeAmountForm({
  deal,
  initialAmountUsd,
}: {
  deal: DealListItem;
  initialAmountUsd?: number;
}) {
  const router = useRouter();
  const [dollars, setDollars] = useState(
    initialAmountUsd != null ? String(initialAmountUsd) : "",
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(initialAmountUsd != null);

  const maxUsd = useMemo(
    () =>
      maxSubscriptionUsd(deal.totalCostUsd, deal.maxSubscriptionPctOfTotalCost),
    [deal.totalCostUsd, deal.maxSubscriptionPctOfTotalCost],
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const n = parseFloat(dollars.replace(/,/g, ""));
    if (Number.isNaN(n) || n <= 0) {
      setErr("Enter a valid amount.");
      return;
    }
    const amountUsd = Math.floor(n);
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${deal.slug}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountUsd }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setErr(data.error ?? "Could not save subscription.");
        return;
      }
      setOk(true);
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground">{deal.name}</h2>
        <p className="mt-1 text-sm text-muted">
          {deal.city}, {deal.state}
        </p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Minimum investment</dt>
            <dd className="font-medium text-foreground">
              {fmtUsd(MIN_SUBSCRIPTION_USD)} <span className="text-muted">(fixed)</span>
            </dd>
          </div>
          <div>
            <dt className="text-muted">Maximum for this deal</dt>
            <dd className="font-medium text-foreground">
              {fmtUsd(maxUsd)}{" "}
              <span className="text-xs text-muted">
                ({deal.maxSubscriptionPctOfTotalCost}% of total cost{" "}
                {fmtUsd(deal.totalCostUsd)})
              </span>
            </dd>
          </div>
        </dl>
      </div>

      {ok ? (
        <div
          className="rounded-xl border border-green-500/40 bg-green-500/5 p-6 text-sm text-foreground"
          role="status"
        >
          <p className="font-medium">Subscription amount saved.</p>
          <p className="mt-2 text-muted">
            DocSign and definitive documents will follow. You can update your
            amount here until the deal closes. Next:{" "}
            <strong>Fund</strong> your commitment on the Fund page when ready.
          </p>
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border bg-card p-6">
        <div className="space-y-2">
          <label htmlFor="sub-amt" className="text-sm font-medium">
            Subscription amount (USD)
          </label>
          <input
            id="sub-amt"
            type="text"
            inputMode="decimal"
            value={dollars}
            onChange={(e) => setDollars(e.target.value)}
            placeholder="e.g. 25000"
            className="w-full max-w-xs rounded-md border border-border bg-background px-3 py-2"
            required
          />
          <p className="text-xs text-muted">
            Enter a whole dollar amount between {fmtUsd(MIN_SUBSCRIPTION_USD)} and{" "}
            {fmtUsd(maxUsd)}.
          </p>
        </div>
        {err ? <p className="text-sm text-red-500">{err}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Saving…" : ok ? "Update amount" : "Confirm subscription amount"}
        </button>
      </form>
    </div>
  );
}
