/** Minimum subscription amount per deal (USD whole dollars) */
export const MIN_SUBSCRIPTION_USD = 5_000;

/** Max subscription = floor(totalCostUsd × pct / 100) in whole dollars */
export function maxSubscriptionUsd(
  totalCostUsd: number,
  maxPctOfTotalCost: number,
): number {
  if (totalCostUsd <= 0 || maxPctOfTotalCost <= 0) return 0;
  return Math.floor((totalCostUsd * maxPctOfTotalCost) / 100);
}

export function subscriptionAmountValid(
  amountUsd: number,
  totalCostUsd: number,
  maxPctOfTotalCost: number,
): { ok: boolean; min: number; max: number } {
  const min = MIN_SUBSCRIPTION_USD;
  const max = maxSubscriptionUsd(totalCostUsd, maxPctOfTotalCost);
  return {
    ok: amountUsd >= min && amountUsd <= max && Number.isInteger(amountUsd),
    min,
    max,
  };
}
