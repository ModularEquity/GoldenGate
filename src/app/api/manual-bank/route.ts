import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

function digitsOnly(s: string, len: number): boolean {
  const d = s.replace(/\D/g, "");
  return d.length === len;
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rows = await prisma.manualBankAccount.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    accounts: rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    institutionName?: string;
    routingLast4?: string;
    accountLast4?: string;
    nickname?: string;
    accountType?: string;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const institutionName =
    typeof body.institutionName === "string"
      ? body.institutionName.trim()
      : "";
  const routingLast4 =
    typeof body.routingLast4 === "string" ? body.routingLast4.trim() : "";
  const accountLast4 =
    typeof body.accountLast4 === "string" ? body.accountLast4.trim() : "";
  const nickname =
    typeof body.nickname === "string" ? body.nickname.trim() || null : null;
  const accountType =
    typeof body.accountType === "string" && body.accountType.trim()
      ? body.accountType.trim()
      : "checking";

  if (!institutionName || institutionName.length < 2) {
    return NextResponse.json(
      { error: "Institution name is required" },
      { status: 400 },
    );
  }
  if (!digitsOnly(routingLast4, 4)) {
    return NextResponse.json(
      { error: "Routing number: enter last 4 digits only" },
      { status: 400 },
    );
  }
  if (!digitsOnly(accountLast4, 4)) {
    return NextResponse.json(
      { error: "Account number: enter last 4 digits only" },
      { status: 400 },
    );
  }

  const r4 = routingLast4.replace(/\D/g, "").slice(-4);
  const a4 = accountLast4.replace(/\D/g, "").slice(-4);

  const created = await prisma.manualBankAccount.create({
    data: {
      userId: session.user.id,
      institutionName,
      routingLast4: r4,
      accountLast4: a4,
      nickname,
      accountType,
    },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { bankLinkedAt: new Date() },
  });

  return NextResponse.json({
    ok: true,
    account: {
      ...created,
      createdAt: created.createdAt.toISOString(),
    },
  });
}
