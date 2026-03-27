import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/auth-password";
import { applySessionToResponse } from "@/lib/auth-session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };
    const raw = typeof body.email === "string" ? body.email.trim() : "";
    const email = raw.toLowerCase();
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !EMAIL_RE.test(email) || !password) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid email and password." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user?.passwordHash) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "No password on file yet. Use the link from your welcome email to set one, or register first.",
        },
        { status: 401 },
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { ok: false, error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const res = NextResponse.json({ ok: true });
    await applySessionToResponse(res, user.id, user.email);
    return res;
  } catch (e) {
    console.error("[login]", e);
    return NextResponse.json(
      { ok: false, error: "Could not sign in. Try again." },
      { status: 500 },
    );
  }
}
