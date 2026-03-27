-- AlterTable
ALTER TABLE "User" ADD COLUMN "bankLinkedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PlaidAccount" ADD COLUMN "verificationStatus" TEXT NOT NULL DEFAULT 'LINKED';
