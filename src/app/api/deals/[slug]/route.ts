import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { fetchOgImageUrl } from "@/lib/og-image";
import { slugifyName, toDealListItem } from "@/lib/deals";
import type { DealStatus } from "@prisma/client";

function requireEmployee(session: Session | null) {
  return session?.user?.role === "EMPLOYEE";
}

type Ctx = { params: Promise<{ slug: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await auth();
  if (!requireEmployee(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { slug } = await ctx.params;
  const deal = await prisma.deal.findUnique({ where: { slug } });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const numOpt = (k: string) => {
    const v = body[k];
    if (v === undefined) return undefined;
    if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(String(v).replace(/[^0-9.-]/g, ""));
      return Number.isFinite(n) ? Math.round(n) : undefined;
    }
    return undefined;
  };

  const debtRatePct = (() => {
    if (body.debtRatePct === undefined) return Number(deal.debtRatePct);
    const v = body.debtRatePct;
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = parseFloat(v.replace(/[^0-9.-]/g, ""));
      return Number.isFinite(n) ? n : Number(deal.debtRatePct);
    }
    return Number(deal.debtRatePct);
  })();

  let propertyUrl = deal.propertyUrl;
  if (typeof body.propertyUrl === "string" && body.propertyUrl.trim()) {
    propertyUrl = body.propertyUrl.trim();
  }

  let thumbnailUrl = deal.thumbnailUrl;
  if (body.refreshThumbnail === true || body.propertyUrlChanged === true) {
    thumbnailUrl = (await fetchOgImageUrl(propertyUrl)) ?? deal.thumbnailUrl;
  }

  let highlights = deal.highlights as string[] | null;
  if (typeof body.highlights === "string") {
    const lines = body.highlights
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    highlights = lines.length ? lines : null;
  }

  let closeDate = deal.closeDate;
  if (typeof body.closeDate === "string") {
    if (!body.closeDate.trim()) {
      closeDate = null;
    } else {
      const d = new Date(body.closeDate + "T12:00:00");
      if (!Number.isNaN(d.getTime())) closeDate = d;
    }
  }

  let newSlug = deal.slug;
  if (typeof body.slug === "string" && body.slug.trim()) {
    const s = body.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");
    if (s && s !== deal.slug) {
      const clash = await prisma.deal.findFirst({
        where: { slug: s, NOT: { id: deal.id } },
      });
      newSlug = clash ? slugifyName(s + "-" + deal.id.slice(0, 6)) : s;
    }
  }

  const status: DealStatus =
    body.status === "OPEN" || body.status === "CLOSING" || body.status === "CLOSED"
      ? body.status
      : deal.status;

  let maxPct = deal.maxSubscriptionPctOfTotalCost;
  if (body.maxSubscriptionPctOfTotalCost !== undefined) {
    const p = Number(body.maxSubscriptionPctOfTotalCost);
    if (Number.isFinite(p) && p >= 1 && p <= 100) {
      maxPct = Math.floor(p);
    }
  }

  let ltvPct = deal.ltvPct;
  if (body.ltvPct !== undefined) {
    const p = Number(body.ltvPct);
    if (Number.isFinite(p) && p >= 0 && p <= 100) ltvPct = Math.floor(p);
  }

  const parseDate = (k: string): Date | null | undefined => {
    if (body[k] === undefined) return undefined;
    if (typeof body[k] !== "string" || !String(body[k]).trim()) return null;
    const d = new Date(String(body[k]) + "T12:00:00");
    return Number.isNaN(d.getTime()) ? undefined : d;
  };

  const renovationCompleteDate = parseDate("renovationCompleteDate");
  const listingDate = parseDate("listingDate");
  const saleTargetDate = parseDate("saleTargetDate");

  let gpContributionUsd = deal.gpContributionUsd;
  if (body.gpContributionUsd !== undefined) {
    const g = numOpt("gpContributionUsd");
    if (g !== undefined && g >= 0) gpContributionUsd = g;
  }

  const updated = await prisma.deal.update({
    where: { id: deal.id },
    data: {
      slug: newSlug,
      name:
        typeof body.name === "string" && body.name.trim()
          ? body.name.trim()
          : deal.name,
      city:
        typeof body.city === "string" && body.city.trim()
          ? body.city.trim()
          : deal.city,
      state:
        typeof body.state === "string" && body.state.trim()
          ? body.state.trim()
          : deal.state,
      summary:
        typeof body.summary === "string" && body.summary.trim()
          ? body.summary.trim()
          : deal.summary,
      highlights: highlights ?? undefined,
      propertyUrl,
      thumbnailUrl,
      status,
      purchaseUsd: numOpt("purchaseUsd") ?? deal.purchaseUsd,
      saleUsd: numOpt("saleUsd") ?? deal.saleUsd,
      holdPeriodMonths: numOpt("holdPeriodMonths") ?? deal.holdPeriodMonths,
      debtRatePct: debtRatePct,
      renoBudgetUsd: numOpt("renoBudgetUsd") ?? deal.renoBudgetUsd,
      transactionFeesUsd:
        numOpt("transactionFeesUsd") ?? deal.transactionFeesUsd,
      totalCostUsd: numOpt("totalCostUsd") ?? deal.totalCostUsd,
      profitUsd: numOpt("profitUsd") ?? deal.profitUsd,
      moneyToCloseUsd: numOpt("moneyToCloseUsd") ?? deal.moneyToCloseUsd,
      closeDate,
      moneyToRenoUsd: numOpt("moneyToRenoUsd") ?? deal.moneyToRenoUsd,
      maxSubscriptionPctOfTotalCost: maxPct,
      ltvPct,
      ...(renovationCompleteDate !== undefined
        ? { renovationCompleteDate }
        : {}),
      ...(listingDate !== undefined ? { listingDate } : {}),
      ...(saleTargetDate !== undefined ? { saleTargetDate } : {}),
      gpContributionUsd,
    },
  });

  return NextResponse.json({ ok: true, deal: toDealListItem(updated) });
}
