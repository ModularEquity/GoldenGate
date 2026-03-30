import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import { canManageDeals } from "@/lib/deal-roles";
import { parseCsv, rowToDealBody } from "@/lib/csv-deal-import";
import { createDealFromBody } from "@/lib/deals-create";
import { toDealListItem } from "@/lib/deals";

function requireDealManager(session: Session | null) {
  return session?.user && canManageDeals(session.user.role);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!requireDealManager(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const ct = request.headers.get("content-type") ?? "";
  let csvText = "";

  if (ct.includes("multipart/form-data")) {
    const form = await request.formData();
    const file = form.get("file");
    if (file instanceof File) {
      csvText = await file.text();
    }
  } else {
    try {
      const body = (await request.json()) as { csv?: string };
      if (typeof body.csv === "string") csvText = body.csv;
    } catch {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }
  }

  if (!csvText.trim()) {
    return NextResponse.json(
      { error: "Provide CSV text or multipart file field 'file'" },
      { status: 400 },
    );
  }

  let rows: ReturnType<typeof parseCsv>["rows"];
  try {
    rows = parseCsv(csvText).rows;
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Invalid CSV" },
      { status: 400 },
    );
  }

  const results: { row: number; slug?: string; error?: string }[] = [];
  const created: ReturnType<typeof toDealListItem>[] = [];

  for (let i = 0; i < rows.length; i++) {
    const body = rowToDealBody(rows[i]);
    const rowNum = i + 2;
    const result = await createDealFromBody(body, session!.user.id);
    if (!result.ok) {
      results.push({ row: rowNum, error: result.error });
    } else {
      results.push({ row: rowNum, slug: result.deal.slug });
      created.push(toDealListItem(result.deal));
    }
  }

  return NextResponse.json({
    ok: true,
    imported: created.length,
    failed: results.filter((r) => r.error).length,
    results,
    deals: created,
  });
}
