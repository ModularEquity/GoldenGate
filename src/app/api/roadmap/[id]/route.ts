import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { RoadmapColumn } from "@prisma/client";

const COLUMNS: RoadmapColumn[] = ["BACKLOG", "IN_PROGRESS", "DONE"];

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;

  let body: { column?: string };
  try {
    body = (await request.json()) as { column?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const col = body.column as RoadmapColumn | undefined;
  if (!col || !COLUMNS.includes(col)) {
    return NextResponse.json(
      { error: "column must be BACKLOG, IN_PROGRESS, or DONE" },
      { status: 400 },
    );
  }

  const existing = await prisma.roadmapItem.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const maxOrder = await prisma.roadmapItem.aggregate({
    where: { column: col },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1;

  const item = await prisma.roadmapItem.update({
    where: { id },
    data: { column: col, sortOrder },
    include: {
      createdBy: { select: { email: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, item });
}
