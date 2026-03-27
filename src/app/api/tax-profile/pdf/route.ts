import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { parseTaxProfile } from "@/lib/tax-profile";
import { buildTaxProfilePdf } from "@/lib/tax-pdf";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { taxProfileJson: true },
  });

  const profile = parseTaxProfile(user?.taxProfileJson);
  if (!profile) {
    return NextResponse.json(
      { error: "Save your tax information first." },
      { status: 400 },
    );
  }

  const bytes = await buildTaxProfilePdf(profile, session.user.email);
  const safeName = profile.legalName.replace(/[^\w\- ]+/g, "").slice(0, 40) || "investor";

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="modular-equity-tax-intake-${safeName}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
