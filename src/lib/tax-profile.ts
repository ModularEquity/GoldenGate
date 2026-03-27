import type { Prisma } from "@prisma/client";

export type TaxFormType = "W9" | "W8BEN" | "W8BENE";

export type TaxProfile = {
  formType: TaxFormType;
  /** Legal name as shown on tax form */
  legalName: string;
  /** Business / disregarded entity name if applicable */
  businessName?: string;
  /** Full TIN (SSN or EIN) — digits only, stored encrypted-at-rest in DB via app security practices */
  tin: string;
  /** US entity type for W-9 Line 3 */
  federalClassification?: string;
  /** Address line 1 */
  addressLine1: string;
  addressLine2?: string;
  city: string;
  stateOrProvince: string;
  postalCode: string;
  country: string;
  /** W-8: treaty country / article — optional */
  treatyCountry?: string;
  /** Certification checkbox acknowledged */
  certifiedAt?: string;
};

export const emptyTaxProfile = (): TaxProfile => ({
  formType: "W9",
  legalName: "",
  tin: "",
  addressLine1: "",
  city: "",
  stateOrProvince: "",
  postalCode: "",
  country: "United States",
});

/** US: SSN 9 digits or EIN 9 digits */
export function normalizeTinDigits(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function isValidUsTin(digits: string): boolean {
  return digits.length === 9 && /^\d{9}$/.test(digits);
}

export function maskTinForPdf(digits: string): string {
  if (digits.length < 4) return "—";
  return `***-**-${digits.slice(-4)}`;
}

export function parseTaxProfile(
  json: Prisma.JsonValue | null | undefined,
): TaxProfile | null {
  if (!json || typeof json !== "object" || Array.isArray(json)) return null;
  const o = json as Record<string, unknown>;
  if (typeof o.legalName !== "string") return null;

  let tin = "";
  if (typeof o.tin === "string" && o.tin) {
    tin = normalizeTinDigits(o.tin);
  } else if (typeof o.tinLast4 === "string" && o.tinLast4) {
    tin = normalizeTinDigits(o.tinLast4);
  }

  return {
    formType:
      o.formType === "W8BEN" || o.formType === "W8BENE"
        ? o.formType
        : "W9",
    legalName: o.legalName,
    businessName:
      typeof o.businessName === "string" ? o.businessName : undefined,
    tin,
    federalClassification:
      typeof o.federalClassification === "string"
        ? o.federalClassification
        : undefined,
    addressLine1: typeof o.addressLine1 === "string" ? o.addressLine1 : "",
    addressLine2:
      typeof o.addressLine2 === "string" ? o.addressLine2 : undefined,
    city: typeof o.city === "string" ? o.city : "",
    stateOrProvince:
      typeof o.stateOrProvince === "string" ? o.stateOrProvince : "",
    postalCode: typeof o.postalCode === "string" ? o.postalCode : "",
    country: typeof o.country === "string" ? o.country : "",
    treatyCountry:
      typeof o.treatyCountry === "string" ? o.treatyCountry : undefined,
    certifiedAt:
      typeof o.certifiedAt === "string" ? o.certifiedAt : undefined,
  };
}
