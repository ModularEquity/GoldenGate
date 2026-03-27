import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { userOnboardingSelect } from "@/lib/onboarding-status";
import { CompleteStepButton } from "@/components/CompleteStepButton";
import { OnboardingStepCard } from "@/components/OnboardingStepCard";

export const metadata = { title: "Register investor account — Modular Equity" };

export default async function RegisterInvestorPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: userOnboardingSelect,
  });
  if (!user) redirect("/login");

  const complete = user.investorProfileCompletedAt != null;

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
        title="Register investor account"
        description={
          <>
            Legal name, entity type, accreditation status, and subscription
            eligibility. DocSign will capture signatures; for now confirm your
            details below and mark complete when ready.
          </>
        }
      >
        <div className="space-y-4 text-sm text-muted">
          <p>
            <strong className="text-foreground">Accredited investor</strong> — By
            proceeding you represent that you meet applicable accreditation or
            qualification requirements for private offerings. Final determination is
            made in subscription documents.
          </p>
          <p>
            <strong className="text-foreground">Entity investors</strong> — Have
            formation documents and authorized signers ready for DocSign.
          </p>
          <CompleteStepButton
            step="investorProfile"
            complete={complete}
            label="Confirm & mark complete"
          />
        </div>
      </OnboardingStepCard>
    </div>
  );
}
