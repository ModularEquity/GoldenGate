import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth-session";

export async function GET() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wallets = await prisma.wallet.findMany({
    where: { userId: session.sub },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ wallets });
}

export async function POST(request: Request) {
  const session = await getSessionFromCookies();
  if (!session) {
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
      userId: session.sub,
      label,
      address,
      chain,
    },
  });

  return NextResponse.json({ wallet });
}
