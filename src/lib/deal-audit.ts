import type { Deal, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

type DealScalar = Omit<
  Deal,
  "highlights" | "debtRatePct"
> & {
  debtRatePct: number;
  highlights: unknown;
};

const FIELDS_TO_TRACK: (keyof DealScalar)[] = [
  "slug",
  "name",
  "status",
  "city",
  "state",
  "summary",
  "propertyUrl",
  "thumbnailUrl",
  "purchaseUsd",
  "saleUsd",
  "holdPeriodMonths",
  "renoBudgetUsd",
  "transactionFeesUsd",
  "totalCostUsd",
  "profitUsd",
  "moneyToCloseUsd",
  "moneyToRenoUsd",
  "closeDate",
  "ltvPct",
  "maxSubscriptionPctOfTotalCost",
  "gpContributionUsd",
  "renovationCompleteDate",
  "listingDate",
  "saleTargetDate",
];

function serializeVal(
  field: string,
  v: unknown,
): string | null {
  if (v === null || v === undefined) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

export async function logDealChanges(params: {
  dealId: string;
  actorId: string;
  before: Deal;
  after: Deal;
}): Promise<void> {
  const { dealId, actorId, before, after } = params;
  const rows: Prisma.DealAuditLogCreateManyInput[] = [];

  for (const field of FIELDS_TO_TRACK) {
    const oldV = serializeVal(field, before[field as keyof Deal] as unknown);
    const newV = serializeVal(field, after[field as keyof Deal] as unknown);
    if (oldV !== newV) {
      rows.push({
        dealId,
        actorId,
        field,
        oldValue: oldV,
        newValue: newV,
      });
    }
  }

  const oldDebt = Number(before.debtRatePct);
  const newDebt = Number(after.debtRatePct);
  if (oldDebt !== newDebt) {
    rows.push({
      dealId,
      actorId,
      field: "debtRatePct",
      oldValue: String(oldDebt),
      newValue: String(newDebt),
    });
  }

  const oldHl = JSON.stringify(before.highlights ?? null);
  const newHl = JSON.stringify(after.highlights ?? null);
  if (oldHl !== newHl) {
    rows.push({
      dealId,
      actorId,
      field: "highlights",
      oldValue: oldHl,
      newValue: newHl,
    });
  }

  if (rows.length === 0) return;

  await prisma.dealAuditLog.createMany({ data: rows });
}

export async function logDealCreated(params: {
  dealId: string;
  actorId: string;
  deal: Deal;
}): Promise<void> {
  const { dealId, actorId, deal } = params;
  await prisma.dealAuditLog.create({
    data: {
      dealId,
      actorId,
      field: "__created__",
      oldValue: null,
      newValue: deal.name,
    },
  });
}
