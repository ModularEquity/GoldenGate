-- CreateEnum
CREATE TYPE "MagicLinkPurpose" AS ENUM ('SET_PASSWORD', 'RESET_PASSWORD');

-- AlterTable
ALTER TABLE "MagicLinkToken" ADD COLUMN "purpose" "MagicLinkPurpose" NOT NULL DEFAULT 'SET_PASSWORD';
