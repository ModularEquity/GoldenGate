import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { buildContractorScopePlaceholderPdf } from "@/lib/contractor-scope-pdf";

type Ctx = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await ctx.params;
  const deal = await prisma.deal.findUnique({
    where: { slug },
    select: { name: true },
  });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const bytes = await buildContractorScopePlaceholderPdf(deal.name);
  const safe = deal.name.replace(/[^\w\- ]+/g, "").slice(0, 40) || "deal";

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="contractor-scope-estimate-${safe}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
