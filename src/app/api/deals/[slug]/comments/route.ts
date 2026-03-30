import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const deal = await prisma.deal.findUnique({ where: { slug }, select: { id: true } });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const comments = await prisma.dealComment.findMany({
    where: { dealId: deal.id },
    orderBy: { createdAt: "asc" },
    include: {
      user: { select: { id: true, email: true, name: true } },
      votes: true,
    },
  });

  const byParent = new Map<string | null, typeof comments>();
  for (const c of comments) {
    const k = c.parentId;
    if (!byParent.has(k)) byParent.set(k, []);
    byParent.get(k)!.push(c);
  }

  function buildVotes(votes: { kind: string }[]) {
    let likes = 0;
    let up = 0;
    let down = 0;
    for (const v of votes) {
      if (v.kind === "LIKE") likes++;
      if (v.kind === "UPVOTE") up++;
      if (v.kind === "DOWNVOTE") down++;
    }
    return { likes, upvotes: up, downvotes: down };
  }

  type Mapped = {
    id: string;
    body: string;
    createdAt: string;
    user: (typeof comments)[0]["user"];
    likes: number;
    upvotes: number;
    downvotes: number;
    myVote: string | null;
    replies: Mapped[];
  };

  function mapComment(
    c: (typeof comments)[0],
    myUserId: string,
  ): Mapped {
    const mine = c.votes.find((v) => v.userId === myUserId);
    const children = (byParent.get(c.id) ?? []).map((r) => mapComment(r, myUserId));
    return {
      id: c.id,
      body: c.body,
      createdAt: c.createdAt.toISOString(),
      user: c.user,
      ...buildVotes(c.votes),
      myVote: mine?.kind ?? null,
      replies: children,
    };
  }

  const roots = byParent.get(null) ?? [];
  const tree = roots.map((c) => mapComment(c, session.user.id));

  return NextResponse.json({ comments: tree });
}

export async function POST(request: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const deal = await prisma.deal.findUnique({ where: { slug }, select: { id: true } });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: { body?: string; parentId?: string | null };
  try {
    body = (await request.json()) as { body?: string; parentId?: string | null };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (!text || text.length > 8000) {
    return NextResponse.json(
      { error: "body is required (max 8000 chars)" },
      { status: 400 },
    );
  }

  let parentId: string | null = null;
  if (typeof body.parentId === "string" && body.parentId.trim()) {
    const parent = await prisma.dealComment.findFirst({
      where: { id: body.parentId.trim(), dealId: deal.id },
    });
    if (!parent) {
      return NextResponse.json({ error: "Invalid parent" }, { status: 400 });
    }
    parentId = parent.id;
  }

  const created = await prisma.dealComment.create({
    data: {
      dealId: deal.id,
      userId: session.user.id,
      parentId,
      body: text,
    },
    include: {
      user: { select: { id: true, email: true, name: true } },
      votes: true,
    },
  });

  return NextResponse.json({
    ok: true,
    comment: {
      id: created.id,
      body: created.body,
      createdAt: created.createdAt.toISOString(),
      user: created.user,
      likes: 0,
      upvotes: 0,
      downvotes: 0,
      myVote: null,
      replies: [],
    },
  });
}
