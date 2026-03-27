-- AlterTable
ALTER TABLE "FundingIntent" ADD COLUMN "manualBankAccountId" TEXT;

-- CreateIndex
CREATE INDEX "FundingIntent_manualBankAccountId_idx" ON "FundingIntent"("manualBankAccountId");

-- AddForeignKey
ALTER TABLE "FundingIntent" ADD CONSTRAINT "FundingIntent_manualBankAccountId_fkey" FOREIGN KEY ("manualBankAccountId") REFERENCES "ManualBankAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;
