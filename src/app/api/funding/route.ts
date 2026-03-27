import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth-session";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [intents, plaidAccounts] = await Promise.all([
    prisma.fundingIntent.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { plaidAccount: true },
    }),
    prisma.plaidAccount.findMany({
      where: { userId: session.sub },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        institutionName: true,
        mask: true,
        name: true,
        subtype: true,
        createdAt: true,
      },
    }),
  ]);

  return NextResponse.json({ intents, plaidAccounts });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    amountCents?: number;
    plaidAccountId?: string | null;
    note?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const amountCents =
    typeof body.amountCents === "number" && Number.isFinite(body.amountCents)
      ? Math.floor(body.amountCents)
      : 0;

  if (amountCents < 100) {
    return NextResponse.json(
      { error: "Minimum funding amount is $1.00 (100 cents)." },
      { status: 400 },
    );
  }

  let plaidAccountId: string | null = null;
  if (typeof body.plaidAccountId === "string" && body.plaidAccountId) {
    const acc = await prisma.plaidAccount.findFirst({
      where: { id: body.plaidAccountId, userId: session.sub },
    });
    if (!acc) {
      return NextResponse.json(
        { error: "Selected bank account not found." },
        { status: 400 },
      );
    }
    plaidAccountId = acc.id;
  }

  const note =
    typeof body.note === "string" ? body.note.slice(0, 500) : undefined;

  const intent = await prisma.fundingIntent.create({
    data: {
      userId: session.sub,
      amountCents,
      plaidAccountId,
      note,
      status: "COMPLETED",
    },
  });

  return NextResponse.json({
    ok: true,
    intent,
    message:
      "Funding request recorded. Live ACH debits require Plaid Transfer / Stripe — connect in production.",
  });
}
