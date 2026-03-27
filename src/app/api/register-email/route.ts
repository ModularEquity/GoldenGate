import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAppUrl } from "@/lib/app-url";
import { sendWelcomeMagicLink } from "@/lib/email";
import { createMagicLinkToken } from "@/lib/magic-link";
import { roleFromEmail } from "@/lib/roles";
import { ensureUserReferralCode } from "@/lib/ensure-referral-code";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; ref?: string };
    const raw = typeof body.email === "string" ? body.email.trim() : "";
    const email = raw.toLowerCase();
    const refRaw =
      typeof body.ref === "string" ? body.ref.trim().toUpperCase() : "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const role = roleFromEmail(email);
    const user = await prisma.user.upsert({
      where: { email },
      create: { email, role },
      update: { role },
    });

    if (refRaw && !user.referredByCode) {
      const referrer = await prisma.user.findFirst({
        where: { referralCode: refRaw },
        select: { id: true },
      });
      if (referrer && referrer.id !== user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { referredByCode: refRaw },
        });
      }
    }

    await ensureUserReferralCode(user.id);

    const { rawToken } = await createMagicLinkToken(user.id, "SET_PASSWORD");

    const base = getAppUrl();
    const magicLinkUrl = `${base}/set-password?token=${encodeURIComponent(rawToken)}`;

    const emailResult = await sendWelcomeMagicLink({ to: email, magicLinkUrl });

    if (emailResult.sent) {
      return NextResponse.json({ ok: true, emailSent: true });
    }

    if (emailResult.reason === "missing_api_key") {
      return NextResponse.json({
        ok: true,
        emailSent: false,
        emailIssue: "missing_resend_key" as const,
      });
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "We saved your email but could not send the message. Check Resend (domain + API key) in Vercel.",
      },
      { status: 503 },
    );
  } catch (e) {
    console.error("[register-email]", e);
    return NextResponse.json(
      { ok: false, error: "Could not complete registration. Try again later." },
      { status: 500 },
    );
  }
}
