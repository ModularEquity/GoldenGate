import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { userOnboardingSelect } from "@/lib/onboarding-status";
import { parseTaxProfile } from "@/lib/tax-profile";
import { OnboardingStepCard } from "@/components/OnboardingStepCard";
import { TaxIntakeForm } from "@/components/TaxIntakeForm";

export const metadata = { title: "Tax forms — Modular Equity" };

export default async function TaxOnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      ...userOnboardingSelect,
      taxProfileJson: true,
    },
  });
  if (!user) redirect("/login");

  const complete = user.taxCompletedAt != null;
  const profile = parseTaxProfile(user.taxProfileJson);

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
            Enter your information below. We store <strong>only the last 4 digits</strong>{" "}
            of your TIN for reference. After saving, download a PDF summary for your
            records — retain official IRS forms as required.
          </>
        }
      >
        <TaxIntakeForm initialProfile={profile} />
      </OnboardingStepCard>
    </div>
  );
}
