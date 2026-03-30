import type { Deal as PrismaDeal, DealStatus } from "@prisma/client";

export type DealListItem = {
  id: string;
  slug: string;
  name: string;
  status: DealStatus;
  city: string;
  state: string;
  summary: string;
  propertyUrl: string;
  thumbnailUrl: string | null;
  purchaseUsd: number;
  saleUsd: number;
  totalCostUsd: number;
  maxSubscriptionPctOfTotalCost: number;
};

export type DealDetail = DealListItem & {
  highlights: string[];
  holdPeriodMonths: number;
  debtRatePct: number;
  renoBudgetUsd: number;
  transactionFeesUsd: number;
  profitUsd: number;
  moneyToCloseUsd: number;
  closeDate: Date | null;
  moneyToRenoUsd: number;
  ltvPct: number;
  renovationCompleteDate: Date | null;
  listingDate: Date | null;
  saleTargetDate: Date | null;
};

function parseHighlights(json: PrismaDeal["highlights"]): string[] {
  if (!json || !Array.isArray(json)) return [];
  return json.filter((x): x is string => typeof x === "string");
}

export function toDealDetail(d: PrismaDeal): DealDetail {
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    status: d.status,
    city: d.city,
    state: d.state,
    summary: d.summary,
    propertyUrl: d.propertyUrl,
    thumbnailUrl: d.thumbnailUrl,
    purchaseUsd: d.purchaseUsd,
    saleUsd: d.saleUsd,
    highlights: parseHighlights(d.highlights),
    holdPeriodMonths: d.holdPeriodMonths,
    debtRatePct: Number(d.debtRatePct),
    renoBudgetUsd: d.renoBudgetUsd,
    transactionFeesUsd: d.transactionFeesUsd,
    totalCostUsd: d.totalCostUsd,
    profitUsd: d.profitUsd,
    moneyToCloseUsd: d.moneyToCloseUsd,
    closeDate: d.closeDate,
    moneyToRenoUsd: d.moneyToRenoUsd,
    maxSubscriptionPctOfTotalCost: d.maxSubscriptionPctOfTotalCost,
    ltvPct: d.ltvPct,
    renovationCompleteDate: d.renovationCompleteDate,
    listingDate: d.listingDate,
    saleTargetDate: d.saleTargetDate,
  };
}

export function toDealListItem(d: PrismaDeal): DealListItem {
  return {
    id: d.id,
    slug: d.slug,
    name: d.name,
    status: d.status,
    city: d.city,
    state: d.state,
    summary: d.summary,
    propertyUrl: d.propertyUrl,
    thumbnailUrl: d.thumbnailUrl,
    purchaseUsd: d.purchaseUsd,
    saleUsd: d.saleUsd,
    totalCostUsd: d.totalCostUsd,
    maxSubscriptionPctOfTotalCost: d.maxSubscriptionPctOfTotalCost,
  };
}

export function slugifyName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || `deal-${Date.now()}`;
}
