import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { userOnboardingSelect } from "@/lib/onboarding-status";
import { CompleteStepButton } from "@/components/CompleteStepButton";
import { OnboardingStepCard } from "@/components/OnboardingStepCard";

export const metadata = { title: "Tax forms — Modular Equity" };

export default async function TaxOnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: userOnboardingSelect,
  });
  if (!user) redirect("/login");

  const complete = user.taxCompletedAt != null;

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
        title="Tax — W-9 / W-8BEN / W-8BEN-E"
        description={
          <>
            US persons: <strong className="text-foreground">W-9</strong>. Non-US
            persons: <strong className="text-foreground">W-8BEN</strong> or{" "}
            <strong className="text-foreground">W-8BEN-E</strong> for entities.
            DocSign will collect certified forms; use this step to track readiness.
          </>
        }
      >
        <ul className="list-inside list-disc space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">W-9</strong> — U.S. taxpayer
            identification (individuals and US entities).
          </li>
          <li>
            <strong className="text-foreground">W-8BEN</strong> — Foreign
            individuals claiming treaty benefits.
          </li>
          <li>
            <strong className="text-foreground">W-8BEN-E</strong> — Foreign
            entities.
          </li>
        </ul>
        <p className="mt-4 text-sm text-muted">
          When your tax form path is ready for DocSign (or submitted outside
          this portal), mark complete.
        </p>
        <div className="mt-4">
          <CompleteStepButton
            step="tax"
            complete={complete}
            label="Mark tax path complete"
          />
        </div>
      </OnboardingStepCard>
    </div>
  );
}
