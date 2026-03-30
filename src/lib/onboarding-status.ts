import type { Prisma } from "@prisma/client";

export type OnboardingStepId =
  | "investorProfile"
  | "ppmRisk"
  | "tax"
  | "banking";

export type OnboardingStepStatus = {
  id: OnboardingStepId;
  label: string;
  href: string;
  complete: boolean;
};

const userOnboardingSelect = {
  investorProfileCompletedAt: true,
  ppmRiskCompletedAt: true,
  taxCompletedAt: true,
  wireInstructionsAcknowledgedAt: true,
  bankLinkedAt: true,
  plaidAccounts: { select: { id: true }, take: 1 },
  manualBankAccounts: { select: { id: true }, take: 1 },
} satisfies Prisma.UserSelect;

export type UserOnboardingFields = Prisma.UserGetPayload<{
  select: typeof userOnboardingSelect;
}>;

export type BankLinkCheck = {
  bankLinkedAt: Date | null;
  plaidAccounts: { id: string }[];
  manualBankAccounts: { id: string }[];
};

export function hasBankLinked(u: BankLinkCheck): boolean {
  return (
    u.bankLinkedAt != null ||
    u.plaidAccounts.length > 0 ||
    u.manualBankAccounts.length > 0
  );
}

export function getOnboardingSteps(u: UserOnboardingFields): OnboardingStepStatus[] {
  const bankOk = hasBankLinked(u);
  return [
    {
      id: "investorProfile",
      label: "Register investor account",
      href: "/dashboard/onboarding/register",
      complete: u.investorProfileCompletedAt != null,
    },
    {
      id: "ppmRisk",
      label: "PPM & risk (read / sign)",
      href: "/dashboard/onboarding/ppm-risk",
      complete: u.ppmRiskCompletedAt != null,
    },
    {
      id: "tax",
      label: "Tax — W-9 / W-8BEN / W-8BEN-E",
      href: "/dashboard/onboarding/tax",
      complete: u.taxCompletedAt != null,
    },
    {
      id: "banking",
      label: "Wire / ACH — bank reference & instructions",
      href: "/dashboard/onboarding/banking",
      complete: bankOk && u.wireInstructionsAcknowledgedAt != null,
    },
  ];
}

export function countOutstandingOnboarding(u: UserOnboardingFields): number {
  return getOnboardingSteps(u).filter((s) => !s.complete).length;
}

export { userOnboardingSelect };
