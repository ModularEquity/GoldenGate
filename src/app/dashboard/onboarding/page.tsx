import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { INVESTOR_GOOGLE_DOCS } from "@/lib/investor-resources";
import {
  getOnboardingSteps,
  userOnboardingSelect,
  countOutstandingOnboarding,
  hasBankLinked,
} from "@/lib/onboarding-status";
import { OnboardingStepCard } from "@/components/OnboardingStepCard";
import { CompleteStepButton } from "@/components/CompleteStepButton";

export const metadata = {
  title: "Onboarding — Modular Equity",
};

const docLinkClass =
  "inline-flex items-center gap-1 text-sm text-accent hover:underline";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: userOnboardingSelect,
  });
  if (!user) redirect("/login");

  const steps = getOnboardingSteps(user);
  const outstanding = countOutstandingOnboarding(user);
  const bankLinked = hasBankLinked(user);

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
          Investor onboarding
        </h1>
        <p className="mt-2 text-muted">
          Complete each step below. DocSign flows for questionnaire, tax, and
          signatures will connect here.{" "}
          {outstanding > 0 ? (
            <span className="font-medium text-red-600 dark:text-red-400">
              {outstanding} item{outstanding === 1 ? "" : "s"} outstanding
            </span>
          ) : (
            <span className="font-medium text-green-600 dark:text-green-400">
              All onboarding steps complete
            </span>
          )}
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card/50 p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
          Google Docs & Drive
        </h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <li>
            <a
              href={INVESTOR_GOOGLE_DOCS.ppm}
              target="_blank"
              rel="noopener noreferrer"
              className={docLinkClass}
            >
              PPM — Google Doc ↗
            </a>
          </li>
          <li>
            <a
              href={INVESTOR_GOOGLE_DOCS.riskDisclosures}
              target="_blank"
              rel="noopener noreferrer"
              className={docLinkClass}
            >
              Risk disclosures — Google Doc ↗
            </a>
          </li>
          <li>
            <a
              href={INVESTOR_GOOGLE_DOCS.dealRoomFolder}
              target="_blank"
              rel="noopener noreferrer"
              className={docLinkClass}
            >
              Deal room folder — Google Drive ↗
            </a>
          </li>
        </ul>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <OnboardingStepCard
          complete={steps[0]!.complete}
          title="Register investor account"
          description="Legal entity profile, accreditation, and subscription eligibility — open the full screen to confirm."
        >
          <Link
            href="/dashboard/onboarding/register"
            className="inline-flex text-sm font-medium text-accent hover:underline"
          >
            Open register investor account →
          </Link>
          <div className="mt-4">
            <CompleteStepButton
              step="investorProfile"
              complete={steps[0]!.complete}
            />
          </div>
        </OnboardingStepCard>

        <OnboardingStepCard
          complete={steps[1]!.complete}
          title="PPM & risk (read / sign)"
          description="Review the PPM and risk disclosures. DocSign acknowledgements will be tracked when integrated."
        >
          <div className="flex flex-wrap gap-3">
            <a
              href={INVESTOR_GOOGLE_DOCS.ppm}
              target="_blank"
              rel="noopener noreferrer"
              className={docLinkClass}
            >
              Open PPM ↗
            </a>
            <a
              href={INVESTOR_GOOGLE_DOCS.riskDisclosures}
              target="_blank"
              rel="noopener noreferrer"
              className={docLinkClass}
            >
              Open risk disclosures ↗
            </a>
          </div>
          <Link
            href="/dashboard/onboarding/ppm-risk"
            className="mt-3 inline-flex text-sm font-medium text-accent hover:underline"
          >
            Full PPM & risk screen →
          </Link>
          <div className="mt-4">
            <CompleteStepButton
              step="ppmRisk"
              complete={steps[1]!.complete}
            />
          </div>
        </OnboardingStepCard>

        <OnboardingStepCard
          complete={steps[2]!.complete}
          title="Tax — W-9 / W-8BEN / W-8BEN-E"
          description="DocSign collection for US and non-US tax forms."
        >
          <Link
            href="/dashboard/onboarding/tax"
            className="inline-flex text-sm font-medium text-accent hover:underline"
          >
            Open tax forms screen →
          </Link>
          <div className="mt-4">
            <CompleteStepButton step="tax" complete={steps[2]!.complete} />
          </div>
        </OnboardingStepCard>

        <OnboardingStepCard
          complete={steps[3]!.complete}
          title="Wire / ACH — routing, account, Plaid"
          description={
            <>
              Wire and ACH instructions (Mercury) and bank verification via Plaid
              or manual reference. Use the{" "}
              <Link href="/dashboard/fund" className="text-accent hover:underline">
                Fund
              </Link>{" "}
              page to add a bank account.
            </>
          }
        >
          <Link
            href="/dashboard/onboarding/banking"
            className="inline-flex text-sm font-medium text-accent hover:underline"
          >
            Open wire & banking screen →
          </Link>
          <div className="mt-4">
            <CompleteStepButton
              step="banking"
              complete={steps[3]!.complete}
              disabled={!bankLinked}
            />
          </div>
        </OnboardingStepCard>
      </div>
    </div>
  );
}
