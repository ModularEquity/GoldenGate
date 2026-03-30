-- CreateEnum
CREATE TYPE "RoadmapColumn" AS ENUM ('BACKLOG', 'IN_PROGRESS', 'DONE');

-- CreateTable
CREATE TABLE "RoadmapItem" (
    "id" TEXT NOT NULL,
    "column" "RoadmapColumn" NOT NULL DEFAULT 'BACKLOG',
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RoadmapItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RoadmapItem_column_idx" ON "RoadmapItem"("column");

-- CreateIndex
CREATE INDEX "RoadmapItem_createdById_idx" ON "RoadmapItem"("createdById");

-- AddForeignKey
ALTER TABLE "RoadmapItem" ADD CONSTRAINT "RoadmapItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Seed default roadmap context (product direction)
INSERT INTO "RoadmapItem" ("id", "column", "title", "description", "sortOrder", "createdById", "createdAt")
VALUES
  (
    'rm_seed_stripe',
    'IN_PROGRESS',
    'Stripe: payments & Financial Connections',
    'Move from Plaid for KYC/bank verification. Target: Stripe for processing and bank account linking where supported; manual bank reference as fallback.',
    0,
    NULL,
    CURRENT_TIMESTAMP
  ),
  (
    'rm_seed_kyc',
    'BACKLOG',
    'Defer traditional KYC vendor',
    'Exclude standalone KYC for now; rely on subscription docs + bank linkage path chosen above.',
    1,
    NULL,
    CURRENT_TIMESTAMP
  );
