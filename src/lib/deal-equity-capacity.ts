import { equityUsdFromLtv } from "@/lib/deal-metrics";

export type EquityCapacityBreakdown = {
  equityUsd: number;
  gpUsd: number;
  maxLpUsd: number;
  lpSubscribedUsd: number;
  outstandingUsd: number;
  /** Bar segment widths as % of equity (0-100), sum ≤ 100 */
  gpPct: number;
  lpPct: number;
  outstandingPct: number;
};

export function computeEquityCapacity(
  totalCostUsd: number,
  ltvPct: number,
  gpContributionUsd: number,
  lpSubscribedUsd: number,
): EquityCapacityBreakdown {
  const equityUsd = equityUsdFromLtv(totalCostUsd, ltvPct);
  const gpUsd = Math.max(0, Math.min(gpContributionUsd, equityUsd));
  const maxLpUsd = Math.max(0, equityUsd - gpUsd);
  const lpSub = Math.max(0, Math.min(lpSubscribedUsd, maxLpUsd));
  const outstandingUsd = Math.max(0, maxLpUsd - lpSub);

  const safeDiv = (a: number, b: number) => (b > 0 ? (a / b) * 100 : 0);
  let gpPct = safeDiv(gpUsd, equityUsd);
  let lpPct = safeDiv(lpSub, equityUsd);
  let outstandingPct = safeDiv(outstandingUsd, equityUsd);

  const sum = gpPct + lpPct + outstandingPct;
  if (sum > 100.001 && sum > 0) {
    const f = 100 / sum;
    gpPct *= f;
    lpPct *= f;
    outstandingPct *= f;
  }

  return {
    equityUsd,
    gpUsd,
    maxLpUsd,
    lpSubscribedUsd: lpSub,
    outstandingUsd,
    gpPct,
    lpPct,
    outstandingPct,
  };
}
