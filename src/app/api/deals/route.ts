import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { toDealListItem } from "@/lib/deals";
import { canManageDeals } from "@/lib/deal-roles";
import { createDealFromBody } from "@/lib/deals-create";

function requireDealManager(session: Session | null) {
  return session?.user && canManageDeals(session.user.role);
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
  if (!requireDealManager(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await createDealFromBody(body, session!.user.id);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true, deal: toDealListItem(result.deal) });
}
