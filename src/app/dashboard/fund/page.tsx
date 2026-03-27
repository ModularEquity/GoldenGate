import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { PlaidLinkButton } from "@/components/PlaidLinkButton";
import { WalletSection } from "@/components/WalletSection";
import { FundSection } from "@/components/FundSection";
import { isPlaidConfigured } from "@/lib/plaid-server";

export const metadata = {
  title: "Fund — Modular Equity",
};

export default async function FundPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [wallets, plaidAccounts, intents] = await Promise.all([
    prisma.wallet.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.plaidAccount.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        institutionName: true,
        mask: true,
        name: true,
        subtype: true,
      },
    }),
    prisma.fundingIntent.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  const intentProps = intents.map((i) => ({
    id: i.id,
    amountCents: i.amountCents,
    currency: i.currency,
    status: i.status,
    createdAt: i.createdAt.toISOString(),
    note: i.note,
  }));

  const plaidReady = isPlaidConfigured();

  return (
    <div className="space-y-10">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-accent"
        >
          ← Investor hub
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Fund your commitment
        </h1>
        <p className="mt-2 text-muted">
          Link a bank account with Plaid, add optional wallet addresses, then
          submit a funding request. Live ACH requires Plaid Transfer / Stripe in
          production — requests are logged for operations.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-medium text-foreground">1 · Link bank (Plaid)</h2>
        <p className="mt-2 text-sm text-muted">
          Connect a checking account for ACH. Mercury remains our operating
          bank for wires per onboarding docs.
        </p>
        <div className="mt-4">
          {plaidReady ? (
            <PlaidLinkButton />
          ) : (
            <p className="text-sm text-muted">
              Plaid is not configured (set{" "}
              <code className="rounded bg-background px-1">PLAID_CLIENT_ID</code> and{" "}
              <code className="rounded bg-background px-1">PLAID_API_SECRET</code> or{" "}
              <code className="rounded bg-background px-1">PLAID_SECRET</code>).
            </p>
          )}
        </div>
        {plaidAccounts.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm">
            {plaidAccounts.map((a) => (
              <li key={a.id} className="text-muted">
                <span className="text-foreground">
                  {a.institutionName ?? "Linked account"}
                </span>
                {a.mask ? ` ·•••${a.mask}` : ""}
                {a.name ? ` · ${a.name}` : ""}
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <WalletSection
        initialWallets={wallets.map((w) => ({
          ...w,
          createdAt: w.createdAt.toISOString(),
        }))}
      />

      <FundSection plaidAccounts={plaidAccounts} intents={intentProps} />
    </div>
  );
}
