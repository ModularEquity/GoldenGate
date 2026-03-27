import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { INVESTOR_GOOGLE_DOCS } from "@/lib/investor-resources";
import { userOnboardingSelect } from "@/lib/onboarding-status";
import { CompleteStepButton } from "@/components/CompleteStepButton";
import { OnboardingStepCard } from "@/components/OnboardingStepCard";

const linkClass =
  "inline-flex items-center gap-1 text-accent hover:underline font-medium";

export const metadata = { title: "PPM & risk — Modular Equity" };

export default async function PpmRiskPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: userOnboardingSelect,
  });
  if (!user) redirect("/login");

  const complete = user.ppmRiskCompletedAt != null;

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
        title="PPM & risk disclosures"
        description="Read the Private Placement Memorandum and risk disclosures. DocSign acknowledgements will be tracked when integrated."
      >
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <a
              href={INVESTOR_GOOGLE_DOCS.ppm}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Open PPM ↗
            </a>
            <a
              href={INVESTOR_GOOGLE_DOCS.riskDisclosures}
              target="_blank"
              rel="noopener noreferrer"
              className={linkClass}
            >
              Open risk disclosures ↗
            </a>
          </div>
          <p className="text-sm text-muted">
            After you have reviewed both documents, mark this step complete.
          </p>
          <CompleteStepButton
            step="ppmRisk"
            complete={complete}
            label="Confirm I have reviewed & mark complete"
          />
        </div>
      </OnboardingStepCard>
    </div>
  );
}
