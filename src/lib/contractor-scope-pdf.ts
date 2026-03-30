import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function buildContractorScopePlaceholderPdf(dealName: string): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  let y = 720;

  const line = (text: string, size = 11, b = false) => {
    page.drawText(text, {
      x: 50,
      y,
      size,
      font: b ? bold : font,
      color: rgb(0.12, 0.12, 0.14),
      maxWidth: 512,
    });
    y -= size + 8;
  };

  line("Contractor — Scope & estimate (placeholder)", 14, true);
  y -= 6;
  line(`Property / deal: ${dealName}`, 11);
  line(`Generated: ${new Date().toLocaleDateString("en-US")}`, 10);
  y -= 12;

  const body = [
    "This document is a placeholder for the signed scope of work and line-item",
    "estimate from the contractor. Replace with the final PDF from your GC when",
    "available. Typical sections: scope narrative, demolition, rough-in, finishes,",
    "allowances, contingencies, payment schedule, and change-order policy.",
    "",
    "Modular Equity — internal use only.",
  ];
  for (const t of body) {
    line(t, 10);
  }

  return doc.save();
}
