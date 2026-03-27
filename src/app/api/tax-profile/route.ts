import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import type { TaxProfile } from "@/lib/tax-profile";
import {
  isValidUsTin,
  normalizeTinDigits,
  parseTaxProfile,
} from "@/lib/tax-profile";

function validateBody(body: unknown): TaxProfile | null {
  if (!body || typeof body !== "object") return null;
  const o = body as Record<string, unknown>;
  const formType = o.formType;
  if (formType !== "W9" && formType !== "W8BEN" && formType !== "W8BENE") {
    return null;
  }
  const legalName = typeof o.legalName === "string" ? o.legalName.trim() : "";
  if (legalName.length < 2) return null;

  const tin = normalizeTinDigits(String(o.tin ?? ""));
  if (formType === "W9" && !isValidUsTin(tin)) {
    return null;
  }
  if ((formType === "W8BEN" || formType === "W8BENE") && tin.length < 4) {
    return null;
  }

  const addressLine1 =
    typeof o.addressLine1 === "string" ? o.addressLine1.trim() : "";
  if (addressLine1.length < 3) return null;
  const city = typeof o.city === "string" ? o.city.trim() : "";
  const stateOrProvince =
    typeof o.stateOrProvince === "string" ? o.stateOrProvince.trim() : "";
  const postalCode =
    typeof o.postalCode === "string" ? o.postalCode.trim() : "";
  const country =
    typeof o.country === "string" && o.country.trim()
      ? o.country.trim()
      : "United States";
  if (!city || !postalCode) return null;

  return {
    formType,
    legalName,
    businessName:
      typeof o.businessName === "string" ? o.businessName.trim() || undefined : undefined,
    tin,
    federalClassification:
      typeof o.federalClassification === "string"
        ? o.federalClassification.trim() || undefined
        : undefined,
    addressLine1,
    addressLine2:
      typeof o.addressLine2 === "string" ? o.addressLine2.trim() || undefined : undefined,
    city,
    stateOrProvince,
    postalCode,
    country,
    treatyCountry:
      typeof o.treatyCountry === "string"
        ? o.treatyCountry.trim() || undefined
        : undefined,
    certifiedAt: new Date().toISOString(),
  };
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { taxProfileJson: true, taxCompletedAt: true },
  });

  const profile = parseTaxProfile(user?.taxProfileJson);
  return NextResponse.json({
    profile,
    taxCompletedAt: user?.taxCompletedAt?.toISOString() ?? null,
  });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const profile = validateBody(raw);
  if (!profile) {
    return NextResponse.json(
      {
        error:
          "Invalid or incomplete data. W-9 requires a 9-digit TIN (SSN or EIN). Include full address.",
      },
      { status: 400 },
    );
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      taxProfileJson: profile as object,
      taxCompletedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true, profile });
}
