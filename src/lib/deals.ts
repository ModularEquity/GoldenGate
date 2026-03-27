/**
 * Deal room content. Update `redfinUrl` when the listing is live, or set
 * `NEXT_PUBLIC_UMBERLAND_REDFIN_URL` in Vercel.
 */

export type DealFinancials = {
  purchasePriceUsd: number;
  rehabBudgetUsd: number;
  arvUsd: number;
  projectedEquityMultiple: string;
  projectedIrrPct: string;
  holdPeriodMonths: string;
  minInvestmentUsd: number;
  totalRaiseUsd: number;
  notes?: string;
};

export type Deal = {
  slug: string;
  name: string;
  status: "Open" | "Closing" | "Closed";
  city: string;
  state: string;
  summary: string;
  highlights: string[];
  financials: DealFinancials;
  /** Property listing — set in env or replace below */
  redfinUrl: string;
};

const umberlandRedfin =
  process.env.NEXT_PUBLIC_UMBERLAND_REDFIN_URL?.trim() ||
  "https://www.redfin.com/TX/Austin";

export const DEALS: Deal[] = [
  {
    slug: "umberland-renovation",
    name: "Umberland — Fix & flip (Austin MSA)",
    status: "Open",
    city: "Austin",
    state: "TX",
    summary:
      "Single-family renovation in the Umberland plan; value-add through cosmetic rehab and minor layout optimization with a 6–9 month targeted exit.",
    highlights: [
      "As-is acquisition aligned to wholesale / off-market channel",
      "Renovation scope focused on kitchen, baths, flooring, and curb appeal",
      "Exit underwritten to recent comp set in submarket (see diligence pack)",
      "Mercury operating account; investor reporting via Modular Equity",
    ],
    financials: {
      purchasePriceUsd: 425_000,
      rehabBudgetUsd: 85_000,
      arvUsd: 625_000,
      projectedEquityMultiple: "1.35–1.45x",
      projectedIrrPct: "18–24%",
      holdPeriodMonths: "6–9",
      minInvestmentUsd: 50_000,
      totalRaiseUsd: 1_250_000,
      notes:
        "Figures are illustrative and subject to final underwriting, appraisal, and market conditions. Not an offer to sell securities.",
    },
    redfinUrl: umberlandRedfin,
  },
];

export function getDealBySlug(slug: string): Deal | undefined {
  return DEALS.find((d) => d.slug === slug);
}
