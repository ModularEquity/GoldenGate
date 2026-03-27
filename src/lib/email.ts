/** Default sender — verified domain modularequity.com in Resend. Override via EMAIL_FROM only if needed. */
const DEFAULT_EMAIL_FROM = "Modular Equity <noreply@modularequity.com>";

type SendWelcomeResult =
  | { sent: true; resendId?: string }
  | { sent: false; reason: "missing_api_key" }
  | { sent: false; reason: "resend_error"; status: number; body: string };

async function sendViaResend(params: {
  to: string;
  subject: string;
  text: string;
  html: string;
}): Promise<SendWelcomeResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.EMAIL_FROM ?? DEFAULT_EMAIL_FROM;

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.info("[email] RESEND_API_KEY not set — skipped send to", params.to);
    } else {
      console.warn(
        "[email] RESEND_API_KEY is not set — no email sent. Add RESEND_API_KEY in Vercel → Environment Variables (Production) and redeploy.",
      );
    }
    return { sent: false, reason: "missing_api_key" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [params.to],
      subject: params.subject,
      text: params.text,
      html: params.html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("[email] Resend API error:", res.status, err);
    return {
      sent: false,
      reason: "resend_error",
      status: res.status,
      body: err,
    };
  }

  let resendId: string | undefined;
  try {
    const json = (await res.json()) as { id?: string };
    resendId = json.id;
  } catch {
    /* ignore */
  }
  console.info("[email] Resend OK", resendId ? `id=${resendId}` : "");
  return { sent: true, resendId };
}

export type { SendWelcomeResult };

export async function sendWelcomeMagicLink({
  to,
  magicLinkUrl,
}: {
  to: string;
  magicLinkUrl: string;
}): Promise<SendWelcomeResult> {
  const subject = "Welcome to Modular Equity — set your password";
  const text = [
    "Welcome to Modular Equity.",
    "",
    "Click the link below to create your password and open your investor dashboard:",
    magicLinkUrl,
    "",
    "This link expires in 24 hours.",
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>Welcome to Modular Equity.</p>
    <p>Click the button below to create your password and open your investor dashboard.</p>
    <p><a href="${magicLinkUrl}" style="display:inline-block;padding:12px 20px;background:#0077b6;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">Set your password</a></p>
    <p style="color:#666;font-size:14px;">Or paste this link into your browser:<br/><a href="${magicLinkUrl}">${magicLinkUrl}</a></p>
    <p style="color:#666;font-size:14px;">This link expires in 24 hours.</p>
  `;

  if (!process.env.RESEND_API_KEY?.trim() && process.env.NODE_ENV === "development") {
    console.info(
      "[email] RESEND_API_KEY not set — magic link (dev only):\n",
      magicLinkUrl,
    );
  }

  return sendViaResend({ to, subject, text, html });
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string;
  resetUrl: string;
}): Promise<SendWelcomeResult> {
  const subject = "Reset your Modular Equity password";
  const text = [
    "You asked to reset your Modular Equity password.",
    "",
    "Click the link below (valid 24 hours):",
    resetUrl,
    "",
    "If you didn’t request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>You asked to reset your Modular Equity password.</p>
    <p><a href="${resetUrl}" style="display:inline-block;padding:12px 20px;background:#0077b6;color:#ffffff;text-decoration:none;border-radius:6px;font-weight:600;">Choose a new password</a></p>
    <p style="color:#666;font-size:14px;">Or paste this link:<br/><a href="${resetUrl}">${resetUrl}</a></p>
    <p style="color:#666;font-size:14px;">This link expires in 24 hours.</p>
  `;

  if (!process.env.RESEND_API_KEY?.trim() && process.env.NODE_ENV === "development") {
    console.info("[email] RESEND_API_KEY not set — reset link (dev only):\n", resetUrl);
  }

  return sendViaResend({ to, subject, text, html });
}
