import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.roadmapItem.findMany({
    orderBy: [{ column: "asc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
    include: {
      createdBy: { select: { email: true, name: true } },
    },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { title?: string; description?: string | null };
  try {
    body = (await request.json()) as { title?: string; description?: string | null };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  if (!title || title.length > 200) {
    return NextResponse.json(
      { error: "title is required (max 200 characters)" },
      { status: 400 },
    );
  }

  const description =
    typeof body.description === "string" ? body.description.trim().slice(0, 4000) : null;

  const maxOrder = await prisma.roadmapItem.aggregate({
    where: { column: "BACKLOG" },
    _max: { sortOrder: true },
  });
  const sortOrder = (maxOrder._max.sortOrder ?? 0) + 1;

  const item = await prisma.roadmapItem.create({
    data: {
      title,
      description: description || null,
      column: "BACKLOG",
      sortOrder,
      createdById: session.user.id,
    },
    include: {
      createdBy: { select: { email: true, name: true } },
    },
  });

  return NextResponse.json({ ok: true, item });
}
