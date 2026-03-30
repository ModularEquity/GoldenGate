import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";
import { ClaimReferralOnDashboard } from "@/components/ClaimReferralOnDashboard";
import {
  userOnboardingSelect,
  countOutstandingOnboarding,
  hasBankLinked,
} from "@/lib/onboarding-status";

export const metadata = {
  title: "Dashboard — Modular Equity",
  description: "Your investor dashboard.",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      passwordHash: true,
      accounts: {
        where: { provider: "google" },
        take: 1,
        select: { id: true },
      },
      ...userOnboardingSelect,
    },
  });

  const hasGoogle = (dbUser?.accounts.length ?? 0) > 0;
  const signInComplete =
    Boolean(dbUser?.passwordHash) || hasGoogle;

  const role = session.user.role;
  const isEmployee = role === "EMPLOYEE";

  const outstandingOnboarding =
    dbUser && !isEmployee ? countOutstandingOnboarding(dbUser) : 0;

  return (
    <div className="space-y-10">
      <ClaimReferralOnDashboard />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {isEmployee ? "Employee hub" : "Investor hub"}
        </h1>
        <p className="mt-2 text-muted">
          Signed in as{" "}
          <span className="text-foreground">{session.user.email}</span>
          {isEmployee ? (
            <span className="ml-2 rounded-md bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
              Employee
            </span>
          ) : (
            <span className="ml-2 rounded-md border border-border px-2 py-0.5 text-xs text-muted">
              Investor
            </span>
          )}
        </p>
        {!isEmployee && outstandingOnboarding > 0 ? (
          <p className="mt-3 inline-flex items-center gap-2 rounded-lg border-2 border-red-500/60 bg-red-500/5 px-4 py-2 text-sm font-medium text-red-800 dark:text-red-200">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
              {outstandingOnboarding}
            </span>
            onboarding step{outstandingOnboarding === 1 ? "" : "s"} outstanding —{" "}
            <Link href="/dashboard/onboarding" className="underline">
              continue onboarding
            </Link>
          </p>
        ) : null}
        {!isEmployee && outstandingOnboarding === 0 && dbUser ? (
          <p className="mt-3 text-sm font-medium text-green-700 dark:text-green-400">
            ✓ All onboarding checklist items complete
          </p>
        ) : null}
      </div>

      {!isEmployee ? (
        <OnboardingChecklist
          email={session.user.email ?? ""}
          signInComplete={signInComplete}
          bankLinked={dbUser ? hasBankLinked(dbUser) : false}
          outstandingOnboarding={outstandingOnboarding}
        />
      ) : (
        <section className="rounded-xl border border-accent/40 bg-card p-6">
          <h2 className="font-medium text-foreground">Employee hub</h2>
          <p className="mt-2 text-sm text-muted">
            Use the{" "}
            <strong className="text-foreground">Navigate</strong> ribbon for
            onboarding links, deals, FAQ, and team tools.
          </p>
        </section>
      )}
    </div>
  );
}
