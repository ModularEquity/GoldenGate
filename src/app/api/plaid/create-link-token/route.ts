import { NextResponse } from "next/server";
import { CountryCode, Products } from "plaid";
import { getPlaidClient, isPlaidConfigured } from "@/lib/plaid-server";
import { getSessionFromCookies } from "@/lib/auth-session";

export async function POST() {
  const session = await getSessionFromCookies();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isPlaidConfigured()) {
    return NextResponse.json(
      {
        error: "Plaid is not configured",
        code: "PLAID_NOT_CONFIGURED",
      },
      { status: 503 },
    );
  }

  const plaid = getPlaidClient()!;

  try {
    const res = await plaid.linkTokenCreate({
      user: { client_user_id: session.sub },
      client_name: "GoldenGate",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    const link_token = res.data.link_token;
    return NextResponse.json({ link_token });
  } catch (e) {
    console.error("[plaid create-link-token]", e);
    return NextResponse.json(
      { error: "Could not start bank link" },
      { status: 500 },
    );
  }
}
