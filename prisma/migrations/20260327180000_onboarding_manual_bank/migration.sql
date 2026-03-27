-- AlterTable
ALTER TABLE "User" ADD COLUMN "investorProfileCompletedAt" TIMESTAMP(3),
ADD COLUMN "ppmRiskCompletedAt" TIMESTAMP(3),
ADD COLUMN "taxCompletedAt" TIMESTAMP(3),
ADD COLUMN "wireInstructionsAcknowledgedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ManualBankAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nickname" TEXT,
    "institutionName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL DEFAULT 'checking',
    "routingLast4" TEXT NOT NULL,
    "accountLast4" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManualBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ManualBankAccount_userId_idx" ON "ManualBankAccount"("userId");

-- AddForeignKey
ALTER TABLE "ManualBankAccount" ADD CONSTRAINT "ManualBankAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
