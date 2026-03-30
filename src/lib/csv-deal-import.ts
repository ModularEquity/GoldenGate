/** Normalize CSV header to canonical key */
export function normalizeHeader(h: string): string {
  return h
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

export type CsvRow = Record<string, string>;

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "," && !inQuotes) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  out.push(cur.trim());
  return out;
}

export function parseCsv(text: string): { headers: string[]; rows: CsvRow[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) {
    throw new Error("CSV must have a header row and at least one data row.");
  }

  const headerCells = splitCsvLine(lines[0]);
  const headers = headerCells.map((h) => normalizeHeader(h));

  const rows: CsvRow[] = [];
  for (let r = 1; r < lines.length; r++) {
    const cells = splitCsvLine(lines[r]);
    if (cells.every((c) => !c)) continue;
    const row: CsvRow = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    rows.push(row);
  }

  return { headers, rows };
}

const ALIASES: Record<string, string> = {
  deal_name: "name",
  property: "propertyUrl",
  property_url: "propertyUrl",
  listing_url: "propertyUrl",
  purchase: "purchaseUsd",
  sale: "saleUsd",
  exit: "saleUsd",
  hold_months: "holdPeriodMonths",
  hold: "holdPeriodMonths",
  debt_rate: "debtRatePct",
  rate: "debtRatePct",
  reno: "renoBudgetUsd",
  renovation: "renoBudgetUsd",
  fees: "transactionFeesUsd",
  transaction_fees: "transactionFeesUsd",
  total: "totalCostUsd",
  total_cost: "totalCostUsd",
  profit: "profitUsd",
  close_cash: "moneyToCloseUsd",
  money_to_close: "moneyToCloseUsd",
  reno_cash: "moneyToRenoUsd",
  money_to_reno: "moneyToRenoUsd",
  max_sub_pct: "maxSubscriptionPctOfTotalCost",
  gp: "gpContributionUsd",
  gp_contribution: "gpContributionUsd",
  close: "closeDate",
  acquisition_close: "closeDate",
  reno_done: "renovationCompleteDate",
  list: "listingDate",
  listing: "listingDate",
  sale_date: "saleTargetDate",
};

export function rowToDealBody(row: CsvRow): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(row)) {
    if (!v.trim()) continue;
    const key = ALIASES[k] ?? k;
    body[key] = v.trim();
  }
  return body;
}
