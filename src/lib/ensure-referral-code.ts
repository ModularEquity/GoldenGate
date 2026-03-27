import { prisma } from "@/lib/db";
import { generateReferralCode } from "@/lib/referral-code";

/** Assign a unique referral code if missing (lazy migration for existing users). */
export async function ensureUserReferralCode(userId: string): Promise<string> {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { referralCode: true },
  });
  if (existing?.referralCode) return existing.referralCode;

  for (let attempt = 0; attempt < 12; attempt++) {
    const code = generateReferralCode();
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { referralCode: code },
      });
      return code;
    } catch {
      // unique collision — retry
    }
  }
  throw new Error("Could not allocate referral code");
}
