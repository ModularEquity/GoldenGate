/** Default sender — verified domain modularequity.com in Resend. Override via EMAIL_FROM only if needed. */
const DEFAULT_EMAIL_FROM = "GoldenGate <noreply@modularequity.com>";

type SendMagicLinkParams = {
  to: string;
  magicLinkUrl: string;
};

/**
 * Sends welcome + magic link. Uses Resend when RESEND_API_KEY is set;
 * otherwise logs the link (local dev).
 */
export async function sendWelcomeMagicLink({
  to,
  magicLinkUrl,
}: SendMagicLinkParams): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? DEFAULT_EMAIL_FROM;

  const subject = "Welcome to GoldenGate — set your password";
  const text = [
    "Welcome to GoldenGate.",
    "",
    "Click the link below to create your password and open your investor dashboard:",
    magicLinkUrl,
    "",
    "This link expires in 24 hours.",
    "",
    "If you did not request this, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>Welcome to GoldenGate.</p>
    <p>Click the button below to create your password and open your investor dashboard.</p>
    <p><a href="${magicLinkUrl}" style="display:inline-block;padding:12px 20px;background:#c9a227;color:#0c0f14;text-decoration:none;border-radius:6px;font-weight:600;">Set your password</a></p>
    <p style="color:#666;font-size:14px;">Or paste this link into your browser:<br/><a href="${magicLinkUrl}">${magicLinkUrl}</a></p>
    <p style="color:#666;font-size:14px;">This link expires in 24 hours.</p>
  `;

  if (!apiKey) {
    console.info(
      "[email] RESEND_API_KEY not set — magic link (dev only):\n",
      magicLinkUrl,
    );
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${res.status} ${err}`);
  }
}
