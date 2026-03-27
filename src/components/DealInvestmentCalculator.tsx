"use client";

import { useMemo, useState } from "react";
import { formatPct } from "@/lib/deal-metrics";

function fmtUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

/**
 * Illustrative: investor share of project profit proportional to principal vs total cost.
 */
export function DealInvestmentCalculator({
  totalCostUsd,
  profitUsd,
}: {
  totalCostUsd: number;
  profitUsd: number;
}) {
  const [principalStr, setPrincipalStr] = useState("10000");

  const result = useMemo(() => {
    const p = parseFloat(principalStr.replace(/,/g, ""));
    if (!Number.isFinite(p) || p <= 0 || totalCostUsd <= 0) {
      return null;
    }
    const share = Math.min(1, p / totalCostUsd);
    const expectedProfit = profitUsd * share;
    const roiPct = p > 0 ? (expectedProfit / p) * 100 : 0;
    return { expectedProfit, roiPct, share };
  }, [principalStr, totalCostUsd, profitUsd]);

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Investment calculator
      </h2>
      <p className="mt-2 text-sm text-muted">
        Illustrative only: assumes your return scales with your share of total
        project cost (profit × principal ÷ total cost). Not tax, fee, or
        waterfall adjusted.
      </p>
      <div className="mt-6 space-y-4">
        <div className="space-y-2">
          <label htmlFor="calc-principal" className="text-sm font-medium">
            Principal amount (USD)
          </label>
          <input
            id="calc-principal"
            type="text"
            inputMode="decimal"
            value={principalStr}
            onChange={(e) => setPrincipalStr(e.target.value)}
            className="w-full max-w-xs rounded-md border border-border bg-background px-3 py-2 text-sm"
          />
          <p className="text-xs text-muted">Defaults to $10,000 — edit to model your commitment.</p>
        </div>
        {result ? (
          <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Your illustrative share of project profit</dt>
                <dd className="font-semibold text-foreground">
                  {fmtUsd(result.expectedProfit)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Return on your principal (illustrative)</dt>
                <dd className="font-semibold text-accent">
                  {formatPct(result.roiPct, 2)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 border-t border-border/50 pt-2 text-xs">
                <dt className="text-muted">Implied weight vs total cost</dt>
                <dd>{formatPct(result.share * 100, 2)}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <p className="text-sm text-muted">Enter a positive principal to see results.</p>
        )}
      </div>
    </section>
  );
}
