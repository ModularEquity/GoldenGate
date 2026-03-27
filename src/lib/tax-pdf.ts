import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { TaxProfile } from "@/lib/tax-profile";
import { maskTinForPdf } from "@/lib/tax-profile";

function labelForForm(t: TaxProfile["formType"]): string {
  switch (t) {
    case "W9":
      return "Substitute W-9 — Taxpayer information (investor intake)";
    case "W8BEN":
      return "Substitute W-8BEN — Foreign individual (investor intake)";
    case "W8BENE":
      return "Substitute W-8BEN-E — Foreign entity (investor intake)";
    default:
      return "Tax information (investor intake)";
  }
}

export async function buildTaxProfilePdf(
  profile: TaxProfile,
  investorEmail: string,
): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const margin = 50;
  let y = 720;

  const draw = (text: string, size = 11, bold = false) => {
    page.drawText(text, {
      x: margin,
      y,
      size,
      font: bold ? fontBold : font,
      color: rgb(0.1, 0.1, 0.1),
      maxWidth: 512,
    });
    y -= size + 6;
  };

  draw("Modular Equity — Investor tax intake", 16, true);
  y -= 6;
  draw(labelForForm(profile.formType), 12, true);
  y -= 10;
  draw(
    "This PDF is generated from information you entered in the investor portal. " +
      "It is not an IRS form. Retain official signed W-9 / W-8 for your records.",
    9,
  );
  y -= 8;
  draw(`Investor email: ${investorEmail}`, 10);
  draw(`Generated: ${new Date().toISOString().slice(0, 10)}`, 10);
  y -= 12;

  const tinDisplay =
    profile.formType === "W9"
      ? maskTinForPdf(profile.tin)
      : profile.tin
        ? `${profile.tin.length} digits on file`
        : "—";

  const lines: [string, string][] = [
    ["Form type", profile.formType],
    ["Legal name", profile.legalName],
    ["Business name", profile.businessName ?? "—"],
    ["TIN (masked)", tinDisplay],
    ["Federal classification (W-9)", profile.federalClassification ?? "—"],
    ["Address", profile.addressLine1],
    ["Address line 2", profile.addressLine2 ?? "—"],
    ["City", profile.city],
    ["State / province", profile.stateOrProvince],
    ["Postal code", profile.postalCode],
    ["Country", profile.country],
    ["Treaty (W-8)", profile.treatyCountry ?? "—"],
    ["Certified", profile.certifiedAt ?? "—"],
  ];

  for (const [k, v] of lines) {
    draw(`${k}:`, 10, true);
    draw(v, 10);
    y -= 4;
  }

  y -= 10;
  draw(
    "Disclaimer: Modular Equity does not provide tax or legal advice. Consult your advisor.",
    8,
  );

  return doc.save();
}
