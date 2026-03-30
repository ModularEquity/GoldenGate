import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const deal = await prisma.deal.findUnique({ where: { slug }, select: { id: true } });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const logs = await prisma.dealAuditLog.findMany({
    where: { dealId: deal.id },
    orderBy: { createdAt: "desc" },
    take: 500,
    include: {
      actor: { select: { email: true, name: true } },
    },
  });

  return NextResponse.json({
    entries: logs.map((l) => ({
      id: l.id,
      field: l.field,
      oldValue: l.oldValue,
      newValue: l.newValue,
      createdAt: l.createdAt.toISOString(),
      actorEmail: l.actor.email,
      actorName: l.actor.name,
    })),
  });
}
