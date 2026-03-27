import { prisma } from "@/lib/db";
import { generateRawToken, hashToken } from "@/lib/tokens";
import type { MagicLinkPurpose } from "@prisma/client";

const TTL_MS = 24 * 60 * 60 * 1000;

export async function createMagicLinkToken(
  userId: string,
  purpose: MagicLinkPurpose,
): Promise<{ rawToken: string }> {
  await prisma.magicLinkToken.deleteMany({
    where: { userId, usedAt: null, purpose },
  });

  const rawToken = generateRawToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TTL_MS);

  await prisma.magicLinkToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
      purpose,
    },
  });

  return { rawToken };
}
