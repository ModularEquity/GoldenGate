/**
 * Deal-level return metrics (illustrative — from underwriting inputs).
 *
 * Unlevered: return on total project cost (as if 100% equity).
 * Levered (actual ROE): debt at LTV% of total cost; equity = (100-LTV)% of total cost;
 *   profit to equity = profit / equity (simplified — ignores interest on debt for headline ROE).
 */

export type DealReturnMetrics = {
  /** Unlevered: profit / total cost */
  unleveredReturnPct: number;
  annualizedUnleveredIrrPct: number;
  /** Equity slice of total cost: (100 - LTV) / 100 */
  equityPctOfTotal: number;
  /** Levered ROE on equity: profit / equity (headline) */
  leveredRoePct: number;
  /** Annualized levered IRR on equity */
  annualizedLeveredIrrPct: number;
  ltvPct: number;
};

export function equityUsdFromLtv(totalCostUsd: number, ltvPct: number): number {
  const ltv = Math.min(100, Math.max(0, ltvPct));
  return (totalCostUsd * (100 - ltv)) / 100;
}

export function computeDealReturnMetrics(
  profitUsd: number,
  totalCostUsd: number,
  holdPeriodMonths: number,
  ltvPct: number,
): DealReturnMetrics {
  const tc = Math.max(1, totalCostUsd);
  const unleveredReturnPct = (profitUsd / tc) * 100;
  const months = Math.max(1, holdPeriodMonths);
  const years = months / 12;
  const annualizedUnleveredIrrPct =
    years > 0
      ? (Math.pow(1 + profitUsd / tc, 1 / years) - 1) * 100
      : unleveredReturnPct;

  const equity = Math.max(1, equityUsdFromLtv(totalCostUsd, ltvPct));
  const leveredRoePct = (profitUsd / equity) * 100;
  const annualizedLeveredIrrPct =
    years > 0
      ? (Math.pow(1 + profitUsd / equity, 1 / years) - 1) * 100
      : leveredRoePct;

  return {
    unleveredReturnPct,
    annualizedUnleveredIrrPct,
    equityPctOfTotal: 100 - Math.min(100, Math.max(0, ltvPct)),
    leveredRoePct,
    annualizedLeveredIrrPct,
    ltvPct,
  };
}

export function formatPct(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
}
