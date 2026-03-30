import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { DealCommentVoteKind } from "@prisma/client";

type Ctx = { params: Promise<{ slug: string; commentId: string }> };

const KINDS: DealCommentVoteKind[] = ["LIKE", "UPVOTE", "DOWNVOTE"];

export async function POST(request: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug, commentId } = await ctx.params;

  const deal = await prisma.deal.findUnique({ where: { slug }, select: { id: true } });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comment = await prisma.dealComment.findFirst({
    where: { id: commentId, dealId: deal.id },
  });
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  let body: { kind?: string };
  try {
    body = (await request.json()) as { kind?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const kind = body.kind as DealCommentVoteKind | undefined;
  if (!kind || !KINDS.includes(kind)) {
    return NextResponse.json(
      { error: "kind must be LIKE, UPVOTE, or DOWNVOTE" },
      { status: 400 },
    );
  }

  const existing = await prisma.dealCommentVote.findUnique({
    where: {
      commentId_userId: { commentId, userId: session.user.id },
    },
  });

  if (existing && existing.kind === kind) {
    await prisma.dealCommentVote.delete({
      where: { id: existing.id },
    });
  } else if (existing) {
    await prisma.dealCommentVote.update({
      where: { id: existing.id },
      data: { kind },
    });
  } else {
    await prisma.dealCommentVote.create({
      data: {
        commentId,
        userId: session.user.id,
        kind,
      },
    });
  }

  const votes = await prisma.dealCommentVote.findMany({
    where: { commentId },
  });
  let likes = 0;
  let up = 0;
  let down = 0;
  for (const v of votes) {
    if (v.kind === "LIKE") likes++;
    if (v.kind === "UPVOTE") up++;
    if (v.kind === "DOWNVOTE") down++;
  }

  const mine = await prisma.dealCommentVote.findUnique({
    where: {
      commentId_userId: { commentId, userId: session.user.id },
    },
  });

  return NextResponse.json({
    ok: true,
    likes,
    upvotes: up,
    downvotes: down,
    myVote: mine?.kind ?? null,
  });
}
