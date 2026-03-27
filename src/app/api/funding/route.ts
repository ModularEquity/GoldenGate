import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [intents, plaidAccounts] = await Promise.all([
    prisma.fundingIntent.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { plaidAccount: true },
    }),
    prisma.plaidAccount.findMany({
      where: { userId: session.user.id },
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
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    amountCents?: number;
    plaidAccountId?: string | null;
    manualBankAccountId?: string | null;
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
  let manualBankAccountId: string | null = null;

  if (typeof body.plaidAccountId === "string" && body.plaidAccountId) {
    const acc = await prisma.plaidAccount.findFirst({
      where: { id: body.plaidAccountId, userId: session.user.id },
    });
    if (!acc) {
      return NextResponse.json(
        { error: "Selected bank account not found." },
        { status: 400 },
      );
    }
    plaidAccountId = acc.id;
  }

  if (typeof body.manualBankAccountId === "string" && body.manualBankAccountId) {
    const m = await prisma.manualBankAccount.findFirst({
      where: { id: body.manualBankAccountId, userId: session.user.id },
    });
    if (!m) {
      return NextResponse.json(
        { error: "Selected manual bank account not found." },
        { status: 400 },
      );
    }
    manualBankAccountId = m.id;
  }

  if (plaidAccountId && manualBankAccountId) {
    return NextResponse.json(
      { error: "Choose either a Plaid-linked account or a manually added account, not both." },
      { status: 400 },
    );
  }

  const note =
    typeof body.note === "string" ? body.note.slice(0, 500) : undefined;

  const intent = await prisma.fundingIntent.create({
    data: {
      userId: session.user.id,
      amountCents,
      plaidAccountId,
      manualBankAccountId,
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
