import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { PlaidLinkButton } from "@/components/PlaidLinkButton";
import { ManualBankSection } from "@/components/ManualBankSection";
import { FundSection } from "@/components/FundSection";
import { isPlaidConfigured } from "@/lib/plaid-server";

export const metadata = {
  title: "Fund — Modular Equity",
};

export default async function FundPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const [manualRows, plaidAccounts, intents] = await Promise.all([
    prisma.manualBankAccount.findMany({
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

  const manualForFund = manualRows.map((w) => ({
    id: w.id,
    institutionName: w.institutionName,
    nickname: w.nickname,
    routingLast4: w.routingLast4,
    accountLast4: w.accountLast4,
  }));

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
          Bank accounts & funding
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          We are <strong className="text-foreground">not</strong> using Plaid for
          KYC or bank verification. Add routing and account{" "}
          <strong className="text-foreground">last 4 digits</strong> manually for
          operations reference, or use{" "}
          <strong className="text-foreground">Stripe</strong> (when configured) for
          payments and Financial Connections. See{" "}
          <Link href="/dashboard/roadmap" className="text-accent hover:underline">
            Product roadmap
          </Link>{" "}
          for status.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="flex flex-col rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">
            Payments & bank link — Stripe (planned)
          </h2>
          <p className="mt-2 text-sm text-muted">
            Target stack: <strong className="text-foreground">Stripe</strong> for
            processing and, where available, bank account connection (Financial
            Connections). This replaces Plaid for new investor flows. Wiring is
            tracked on the roadmap.
          </p>
          <p className="mt-3 text-sm text-muted">
            <Link href="/dashboard/roadmap" className="text-accent hover:underline">
              Product roadmap →
            </Link>
          </p>
          <p className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-3 text-xs text-muted">
            Env placeholders (when implemented):{" "}
            <code className="rounded bg-background px-1">STRIPE_SECRET_KEY</code>,{" "}
            <code className="rounded bg-background px-1">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code>
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="font-semibold text-foreground">
            Add bank — manual (last 4 only)
          </h2>
          <p className="mt-2 text-sm text-muted">
            For operations reference only — we store last four digits of routing
            and account numbers, not full numbers.
          </p>
          <div className="mt-4">
            <ManualBankSection
              initialAccounts={manualRows.map((w) => ({
                ...w,
                createdAt: w.createdAt.toISOString(),
              }))}
            />
          </div>
        </section>
      </div>

      <section className="rounded-xl border border-border/80 bg-card p-6">
        <h2 className="font-semibold text-foreground">
          Legacy: Plaid (optional)
        </h2>
        <p className="mt-2 text-sm text-muted">
          Existing Plaid links remain visible for accounts that already connected.
          New onboarding emphasizes manual reference and Stripe — we are not
          relying on Plaid for KYC or bank verification going forward.
        </p>
        <div className="mt-4">
          {plaidReady ? (
            <PlaidLinkButton />
          ) : (
            <p className="text-sm text-muted">
              Plaid is not configured (optional).
            </p>
          )}
        </div>
        {plaidAccounts.length > 0 ? (
          <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
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

      <FundSection
        plaidAccounts={plaidAccounts}
        manualAccounts={manualForFund}
        intents={intentProps}
      />
    </div>
  );
}
