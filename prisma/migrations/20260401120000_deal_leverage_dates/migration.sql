-- AlterTable
ALTER TABLE "Deal" ADD COLUMN "ltvPct" INTEGER NOT NULL DEFAULT 80;
ALTER TABLE "Deal" ADD COLUMN "renovationCompleteDate" DATE;
ALTER TABLE "Deal" ADD COLUMN "listingDate" DATE;
ALTER TABLE "Deal" ADD COLUMN "saleTargetDate" DATE;

-- Umberland milestone dates (2025)
UPDATE "Deal"
SET
  "renovationCompleteDate" = '2025-05-20',
  "listingDate" = '2025-05-23',
  "saleTargetDate" = '2025-07-04',
  "ltvPct" = 80
WHERE "slug" = '2915-umberland-dr-atlanta';
