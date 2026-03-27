-- AlterTable
ALTER TABLE "Deal" ADD COLUMN "maxSubscriptionPctOfTotalCost" INTEGER NOT NULL DEFAULT 20;

-- CreateTable
CREATE TABLE "DealSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DealSubscription_userId_dealId_key" ON "DealSubscription"("userId", "dealId");

-- CreateIndex
CREATE INDEX "DealSubscription_dealId_idx" ON "DealSubscription"("dealId");

-- AddForeignKey
ALTER TABLE "DealSubscription" ADD CONSTRAINT "DealSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DealSubscription" ADD CONSTRAINT "DealSubscription_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
