import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ wallets });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { label?: string; address?: string; chain?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const label = typeof body.label === "string" ? body.label.trim() : "";
  const address = typeof body.address === "string" ? body.address.trim() : "";
  const chain =
    typeof body.chain === "string" ? body.chain.trim() || null : null;

  if (!label || !address) {
    return NextResponse.json(
      { error: "Label and wallet address are required." },
      { status: 400 },
    );
  }

  const wallet = await prisma.wallet.create({
    data: {
      userId: session.user.id,
      label,
      address,
      chain,
    },
  });

  return NextResponse.json({ wallet });
}
