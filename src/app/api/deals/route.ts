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

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    deals: deals.map(toDealListItem),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!requireEmployee(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const propertyUrl =
    typeof body.propertyUrl === "string" ? body.propertyUrl.trim() : "";
  if (!name || !propertyUrl) {
    return NextResponse.json(
      { error: "name and propertyUrl are required" },
      { status: 400 },
    );
  }

  const slugRaw =
    typeof body.slug === "string" && body.slug.trim()
      ? body.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-")
      : slugifyName(name);

  const existing = await prisma.deal.findUnique({ where: { slug: slugRaw } });
  const slug = existing ? `${slugRaw}-${Date.now().toString(36)}` : slugRaw;

  const num = (k: string) => {
    const v = body[k];
    if (typeof v === "number" && Number.isFinite(v)) return Math.round(v);
    if (typeof v === "string" && v.trim() !== "") {
      const n = Number(v.replace(/[^0-9.-]/g, ""));
      return Number.isFinite(n) ? Math.round(n) : null;
    }
    return null;
  };

  const purchaseUsd = num("purchaseUsd");
  const saleUsd = num("saleUsd");
  const holdPeriodMonths = num("holdPeriodMonths");
  const debtRatePct = (() => {
    const v = body.debtRatePct;
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
      const n = parseFloat(v.replace(/[^0-9.-]/g, ""));
      return Number.isFinite(n) ? n : null;
    }
    return null;
  })();
  const renoBudgetUsd = num("renoBudgetUsd");
  const transactionFeesUsd = num("transactionFeesUsd");
  const totalCostUsd = num("totalCostUsd");
  const profitUsd = num("profitUsd");
  const moneyToCloseUsd = num("moneyToCloseUsd");
  const moneyToRenoUsd = num("moneyToRenoUsd");

  if (
    purchaseUsd == null ||
    saleUsd == null ||
    holdPeriodMonths == null ||
    debtRatePct == null ||
    renoBudgetUsd == null ||
    transactionFeesUsd == null ||
    totalCostUsd == null ||
    profitUsd == null ||
    moneyToCloseUsd == null ||
    moneyToRenoUsd == null
  ) {
    return NextResponse.json(
      { error: "All numeric deal fields are required" },
      { status: 400 },
    );
  }

  const city = typeof body.city === "string" ? body.city.trim() : "";
  const state = typeof body.state === "string" ? body.state.trim() : "";
  const summary =
    typeof body.summary === "string" ? body.summary.trim() : "No summary.";
  const status =
    body.status === "CLOSING" || body.status === "CLOSED"
      ? (body.status as DealStatus)
      : "OPEN";

  let highlights: string[] = [];
  if (typeof body.highlights === "string" && body.highlights.trim()) {
    highlights = body.highlights
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  } else if (Array.isArray(body.highlights)) {
    highlights = body.highlights.filter((x): x is string => typeof x === "string");
  }

  let closeDate: Date | null = null;
  if (typeof body.closeDate === "string" && body.closeDate.trim()) {
    const d = new Date(body.closeDate + "T12:00:00");
    if (!Number.isNaN(d.getTime())) closeDate = d;
  }

  const thumbnailUrl = await fetchOgImageUrl(propertyUrl);

  const deal = await prisma.deal.create({
    data: {
      slug,
      name,
      city: city || "—",
      state: state || "—",
      summary,
      ...(highlights.length ? { highlights } : {}),
      propertyUrl,
      thumbnailUrl,
      status,
      purchaseUsd,
      saleUsd,
      holdPeriodMonths,
      debtRatePct,
      renoBudgetUsd,
      transactionFeesUsd,
      totalCostUsd,
      profitUsd,
      moneyToCloseUsd,
      closeDate,
      moneyToRenoUsd,
    },
  });

  return NextResponse.json({ ok: true, deal: toDealListItem(deal) });
}
