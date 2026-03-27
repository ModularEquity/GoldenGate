import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-session";

export const metadata = {
  title: "Fund — GoldenGate",
};

export default async function FundPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/login");

  return (
    <div className="space-y-8">
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
          Link a bank account and send ACH, or schedule auto-debit — Plaid /
          Stripe placeholder.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-medium text-foreground">Bank link & ACH</h2>
        <p className="mt-2 text-sm text-muted">
          Production flow will use Plaid (or your chosen provider) for KYC and
          ACH. Mercury remains the operating bank for wire instructions shown
          during onboarding.
        </p>
        <p className="mt-4 text-sm text-muted">
          Status: <span className="text-foreground">Not connected</span>
        </p>
      </div>
    </div>
  );
}
