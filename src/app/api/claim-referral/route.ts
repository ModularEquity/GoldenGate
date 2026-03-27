import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

/**
 * Attach referredByCode to the current user if they arrived via ?ref= and haven't been set yet.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { ref?: string };
  try {
    body = (await request.json()) as { ref?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ref =
    typeof body.ref === "string" ? body.ref.trim().toUpperCase() : "";
  if (!ref || ref.length < 4) {
    return NextResponse.json({ error: "Invalid ref" }, { status: 400 });
  }

  const referrer = await prisma.user.findFirst({
    where: { referralCode: ref },
    select: { id: true },
  });
  if (!referrer || referrer.id === session.user.id) {
    return NextResponse.json({ error: "Invalid referral" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { referredByCode: true },
  });
  if (user?.referredByCode) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { referredByCode: ref },
  });

  return NextResponse.json({ ok: true });
}
