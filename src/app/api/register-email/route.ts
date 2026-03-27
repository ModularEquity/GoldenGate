import { NextResponse } from "next/server";

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    // Scaffold: log server-side; replace with DB / CRM / email provider.
    console.info("[register-email]", { email, at: new Date().toISOString() });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }
}
