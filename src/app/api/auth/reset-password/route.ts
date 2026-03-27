import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth-password";
import { roleFromEmail } from "@/lib/roles";
import { hashToken } from "@/lib/tokens";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      token?: string;
      password?: string;
    };
    const rawToken = typeof body.token === "string" ? body.token.trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!rawToken || !password) {
      return NextResponse.json(
        { ok: false, error: "Token and password are required." },
        { status: 400 },
      );
    }

    if (password.length < 10) {
      return NextResponse.json(
        {
          ok: false,
          error: "Password must be at least 10 characters.",
        },
        { status: 400 },
      );
    }

    const tokenHash = hashToken(rawToken);
    const record = await prisma.magicLinkToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.purpose !== "RESET_PASSWORD" || record.usedAt) {
      return NextResponse.json(
        { ok: false, error: "This link is invalid or has already been used." },
        { status: 400 },
      );
    }

    if (record.expiresAt < new Date()) {
      return NextResponse.json(
        { ok: false, error: "This link has expired. Request a new reset link." },
        { status: 400 },
      );
    }

    const passwordHash = await hashPassword(password);

    const role = roleFromEmail(record.user.email);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash, role },
      }),
      prisma.magicLinkToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ ok: true, email: record.user.email });
  } catch (e) {
    console.error("[reset-password]", e);
    const detail =
      e instanceof Error ? e.message : "unknown";
    return NextResponse.json(
      {
        ok: false,
        error: "Could not reset password. Try again.",
        ...(process.env.NODE_ENV === "development" ? { debug: detail } : {}),
      },
      { status: 500 },
    );
  }
}
