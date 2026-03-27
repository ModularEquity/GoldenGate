-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('OPEN', 'CLOSING', 'CLOSED');

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "DealStatus" NOT NULL DEFAULT 'OPEN',
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "highlights" JSONB,
    "propertyUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "purchaseUsd" INTEGER NOT NULL,
    "saleUsd" INTEGER NOT NULL,
    "holdPeriodMonths" INTEGER NOT NULL,
    "debtRatePct" DECIMAL(5,2) NOT NULL,
    "renoBudgetUsd" INTEGER NOT NULL,
    "transactionFeesUsd" INTEGER NOT NULL,
    "totalCostUsd" INTEGER NOT NULL,
    "profitUsd" INTEGER NOT NULL,
    "moneyToCloseUsd" INTEGER NOT NULL,
    "closeDate" DATE,
    "moneyToRenoUsd" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Deal_slug_key" ON "Deal"("slug");

-- Umberland — 2915 Umberland Dr, Atlanta GA (seed; edit in app)
INSERT INTO "Deal" (
    "id", "slug", "name", "status", "city", "state", "summary", "highlights",
    "propertyUrl", "thumbnailUrl",
    "purchaseUsd", "saleUsd", "holdPeriodMonths", "debtRatePct",
    "renoBudgetUsd", "transactionFeesUsd", "totalCostUsd", "profitUsd",
    "moneyToCloseUsd", "closeDate", "moneyToRenoUsd", "createdAt", "updatedAt"
) VALUES (
    'deal_seed_umberland',
    '2915-umberland-dr-atlanta',
    '2915 Umberland Dr — Atlanta fix & flip',
    'OPEN',
    'Atlanta',
    'GA',
    'Single-family renovation in Doraville / 30340; value-add rehab with targeted 4-month hold and debt financing at 10%.',
    '["Purchase aligned to market; renovation scope focused on kitchen, baths, and systems","Exit underwritten to $725k sale price","Investor reporting via Modular Equity"]'::jsonb,
    'https://www.redfin.com/GA/Atlanta/2915-Umberland-Dr-30340/home/23811283',
    NULL,
    375000,
    725000,
    4,
    10.00,
    150000,
    50000,
    575000,
    150000,
    50000,
    '2025-04-01',
    100000,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
);
