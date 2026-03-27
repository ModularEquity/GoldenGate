import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/app-url";
import { sendPasswordResetEmail } from "@/lib/email";
import { createMagicLinkToken } from "@/lib/magic-link";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Always respond generically to avoid email enumeration. */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const raw = typeof body.email === "string" ? body.email.trim() : "";
    const email = raw.toLowerCase();

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Enter a valid email address." },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (user?.passwordHash) {
      const { rawToken } = await createMagicLinkToken(user.id, "RESET_PASSWORD");
      const base = getAppUrl();
      const resetUrl = `${base}/reset-password?token=${encodeURIComponent(rawToken)}`;
      await sendPasswordResetEmail({ to: email, resetUrl });
    }

    return NextResponse.json({
      ok: true,
      message:
        "If an account exists for that email, we sent a password reset link.",
    });
  } catch (e) {
    console.error("[forgot-password]", e);
    return NextResponse.json(
      { ok: false, error: "Could not process request. Try again later." },
      { status: 500 },
    );
  }
}
