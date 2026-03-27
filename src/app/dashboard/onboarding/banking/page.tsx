import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { userOnboardingSelect, hasBankLinked } from "@/lib/onboarding-status";
import { CompleteStepButton } from "@/components/CompleteStepButton";
import { OnboardingStepCard } from "@/components/OnboardingStepCard";

export const metadata = { title: "Wire & banking — Modular Equity" };

export default async function BankingOnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: userOnboardingSelect,
  });
  if (!user) redirect("/login");

  const bankOk = hasBankLinked(user);
  const wireOk = user.wireInstructionsAcknowledgedAt != null;
  const complete = bankOk && wireOk;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/dashboard/onboarding"
        className="text-sm text-muted hover:text-accent"
      >
        ← Onboarding overview
      </Link>

      <OnboardingStepCard
        complete={complete}
        title="Wire / ACH — routing, account, Plaid"
        description={
          <>
            Mercury wires and ACH instructions are in onboarding materials. Link
            a bank account on the{" "}
            <Link href="/dashboard/fund" className="text-accent hover:underline">
              Fund
            </Link>{" "}
            page (Plaid or manual last-4 reference), then confirm wire/ACH
            instructions below.
          </>
        }
      >
        <div className="space-y-4 text-sm">
          <div
            className={
              bankOk
                ? "rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-green-800 dark:text-green-300"
                : "rounded-lg border border-red-500/40 bg-red-500/5 p-3 text-red-800 dark:text-red-300"
            }
          >
            {bankOk ? (
              "✓ Bank account on file (Plaid or manual reference)."
            ) : (
              <>
                Add a bank account on the{" "}
                <Link href="/dashboard/fund" className="font-medium underline">
                  Fund
                </Link>{" "}
                page first.
              </>
            )}
          </div>
          <p className="text-muted">
            Wire and ACH routing details follow your operating bank (Mercury)
            instructions in your investor packet. Confirm you have reviewed
            them before marking complete.
          </p>
          <CompleteStepButton
            step="banking"
            complete={complete}
            label="Confirm wire/ACH instructions reviewed & mark complete"
            disabled={!bankOk}
          />
          {!bankOk ? (
            <p className="text-xs text-muted">
              Complete step is enabled after a bank account is added on Fund.
            </p>
          ) : null}
        </div>
      </OnboardingStepCard>
    </div>
  );
}
