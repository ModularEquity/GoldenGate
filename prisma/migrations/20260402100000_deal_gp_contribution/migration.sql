-- AlterTable
ALTER TABLE "Deal" ADD COLUMN "gpContributionUsd" INTEGER NOT NULL DEFAULT 0;

UPDATE "Deal"
SET "gpContributionUsd" = 25000
WHERE "slug" = '2915-umberland-dr-atlanta';
