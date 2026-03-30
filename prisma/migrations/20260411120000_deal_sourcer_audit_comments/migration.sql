-- AlterEnum: add DEAL_SOURCER (PostgreSQL 9.1+)
ALTER TYPE "UserRole" ADD VALUE 'DEAL_SOURCER';

-- DealAuditLog
CREATE TABLE "DealAuditLog" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DealAuditLog_dealId_idx" ON "DealAuditLog"("dealId");
CREATE INDEX "DealAuditLog_createdAt_idx" ON "DealAuditLog"("createdAt");

ALTER TABLE "DealAuditLog" ADD CONSTRAINT "DealAuditLog_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DealAuditLog" ADD CONSTRAINT "DealAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DealCommentVoteKind
CREATE TYPE "DealCommentVoteKind" AS ENUM ('LIKE', 'UPVOTE', 'DOWNVOTE');

-- DealComment
CREATE TABLE "DealComment" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "parentId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DealComment_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "DealComment_dealId_idx" ON "DealComment"("dealId");
CREATE INDEX "DealComment_parentId_idx" ON "DealComment"("parentId");
CREATE INDEX "DealComment_userId_idx" ON "DealComment"("userId");

ALTER TABLE "DealComment" ADD CONSTRAINT "DealComment_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DealComment" ADD CONSTRAINT "DealComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DealComment" ADD CONSTRAINT "DealComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DealComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DealCommentVote
CREATE TABLE "DealCommentVote" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" "DealCommentVoteKind" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DealCommentVote_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DealCommentVote_commentId_userId_key" ON "DealCommentVote"("commentId", "userId");
CREATE INDEX "DealCommentVote_commentId_idx" ON "DealCommentVote"("commentId");

ALTER TABLE "DealCommentVote" ADD CONSTRAINT "DealCommentVote_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "DealComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "DealCommentVote" ADD CONSTRAINT "DealCommentVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
