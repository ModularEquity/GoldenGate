import { NextResponse } from "next/server";
import { CountryCode } from "plaid";
import { prisma } from "@/lib/db";
import { getPlaidClient, isPlaidConfigured } from "@/lib/plaid-server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isPlaidConfigured()) {
    return NextResponse.json(
      { error: "Plaid is not configured" },
      { status: 503 },
    );
  }

  let body: { public_token?: string };
  try {
    body = (await request.json()) as { public_token?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const public_token =
    typeof body.public_token === "string" ? body.public_token.trim() : "";
  if (!public_token) {
    return NextResponse.json({ error: "public_token required" }, { status: 400 });
  }

  const plaid = getPlaidClient()!;

  try {
    const exchange = await plaid.itemPublicTokenExchange({ public_token });
    const access_token = exchange.data.access_token;
    const item_id = exchange.data.item_id;

    const accountsRes = await plaid.accountsGet({ access_token });
    const accounts = accountsRes.data.accounts;
    const item = accountsRes.data.item;
    if (!accounts.length) {
      return NextResponse.json(
        { error: "No accounts returned from Plaid" },
        { status: 422 },
      );
    }

    const primary = accounts[0]!;
    const instId = item.institution_id;
    const instRes = instId
      ? await plaid
          .institutionsGetById({
            institution_id: instId,
            country_codes: [CountryCode.Us],
          })
          .catch(() => null)
      : null;

    const institutionName =
      instRes?.data.institution?.name ?? instId ?? null;

    await prisma.plaidAccount.create({
      data: {
        userId: session.user.id,
        itemId: item_id,
        accessToken: access_token,
        institutionName,
        accountId: primary.account_id,
        mask: primary.mask ?? null,
        name: primary.name ?? null,
        subtype: primary.subtype ?? null,
      },
    });

    return NextResponse.json({ ok: true, accountId: primary.account_id });
  } catch (e) {
    console.error("[plaid exchange]", e);
    return NextResponse.json(
      { error: "Could not link bank account" },
      { status: 500 },
    );
  }
}
