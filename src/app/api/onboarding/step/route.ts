import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { hasBankLinked, type OnboardingStepId } from "@/lib/onboarding-status";

const validSteps: OnboardingStepId[] = [
  "investorProfile",
  "ppmRisk",
  "tax",
  "banking",
];

export async function PATCH(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { step?: string };
  try {
    body = (await request.json()) as { step?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const step = body.step as OnboardingStepId | undefined;
  if (!step || !validSteps.includes(step)) {
    return NextResponse.json({ error: "Invalid step" }, { status: 400 });
  }

  if (step === "banking") {
    const u = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        bankLinkedAt: true,
        plaidAccounts: { select: { id: true }, take: 1 },
        manualBankAccounts: { select: { id: true }, take: 1 },
      },
    });
    if (!u || !hasBankLinked(u)) {
      return NextResponse.json(
        { error: "Add a bank account on the Fund page before completing this step." },
        { status: 400 },
      );
    }
  }

  const now = new Date();
  const data =
    step === "investorProfile"
      ? { investorProfileCompletedAt: now }
      : step === "ppmRisk"
        ? { ppmRiskCompletedAt: now }
        : step === "tax"
          ? { taxCompletedAt: now }
          : { wireInstructionsAcknowledgedAt: now };

  await prisma.user.update({
    where: { id: session.user.id },
    data,
  });

  return NextResponse.json({ ok: true, step });
}
