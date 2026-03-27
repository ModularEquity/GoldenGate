/**
 * Deal-level return metrics (illustrative — from underwriting inputs).
 */

export type DealReturnMetrics = {
  /** Profit / total cost */
  totalReturnPct: number;
  /** Annualized IRR-style return: (1 + totalReturn)^(12/holdMonths) - 1 */
  annualizedIrrPct: number;
};

export function computeDealReturnMetrics(
  profitUsd: number,
  totalCostUsd: number,
  holdPeriodMonths: number,
): DealReturnMetrics {
  const tc = Math.max(1, totalCostUsd);
  const totalReturnPct = (profitUsd / tc) * 100;
  const months = Math.max(1, holdPeriodMonths);
  const years = months / 12;
  const annualizedIrrPct =
    years > 0
      ? (Math.pow(1 + profitUsd / tc, 1 / years) - 1) * 100
      : totalReturnPct;
  return { totalReturnPct, annualizedIrrPct };
}

export function formatPct(n: number, digits = 1): string {
  if (!Number.isFinite(n)) return "—";
  return `${n.toFixed(digits)}%`;
}
