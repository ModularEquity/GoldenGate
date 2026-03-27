import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { subscriptionAmountValid } from "@/lib/subscription-rules";

function requireSession(session: Session | null): session is Session {
  return Boolean(session?.user?.id);
}

type Ctx = { params: Promise<{ slug: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const session = await auth();
  if (!requireSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const deal = await prisma.deal.findUnique({ where: { slug } });
  if (!deal || deal.status !== "OPEN") {
    return NextResponse.json(
      { error: "Deal not found or not open for subscription" },
      { status: 404 },
    );
  }

  let body: { amountUsd?: number };
  try {
    body = (await request.json()) as { amountUsd?: number };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const raw =
    typeof body.amountUsd === "number" && Number.isFinite(body.amountUsd)
      ? body.amountUsd
      : null;
  if (raw == null) {
    return NextResponse.json({ error: "amountUsd required" }, { status: 400 });
  }

  const amountUsd = Math.floor(raw);
  const { ok, min, max } = subscriptionAmountValid(
    amountUsd,
    deal.totalCostUsd,
    deal.maxSubscriptionPctOfTotalCost,
  );

  if (!ok) {
    return NextResponse.json(
      {
        error: `Amount must be between $${min.toLocaleString("en-US")} and $${max.toLocaleString("en-US")} for this deal.`,
        min,
        max,
      },
      { status: 400 },
    );
  }

  const amountCents = amountUsd * 100;

  const sub = await prisma.dealSubscription.upsert({
    where: {
      userId_dealId: { userId: session.user.id, dealId: deal.id },
    },
    create: {
      userId: session.user.id,
      dealId: deal.id,
      amountCents,
    },
    update: { amountCents },
  });

  return NextResponse.json({
    ok: true,
    subscription: {
      id: sub.id,
      dealSlug: deal.slug,
      amountUsd,
      amountCents: sub.amountCents,
    },
  });
}
