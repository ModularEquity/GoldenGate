import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

/** Vercel may use PLAID_API_SECRET; Plaid docs use PLAID_SECRET — accept both */
export function getPlaidSecret(): string | undefined {
  return (
    process.env.PLAID_SECRET?.trim() ||
    process.env.PLAID_API_SECRET?.trim() ||
    undefined
  );
}

function getBasePath(): string {
  const env = process.env.PLAID_ENV?.toLowerCase();
  if (env === "production") return PlaidEnvironments.production;
  return PlaidEnvironments.sandbox;
}

let cached: PlaidApi | null = null;

export function getPlaidClient(): PlaidApi | null {
  const id = process.env.PLAID_CLIENT_ID?.trim();
  const secret = getPlaidSecret();
  if (!id || !secret) return null;

  if (!cached) {
    const configuration = new Configuration({
      basePath: getBasePath(),
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": id,
          "PLAID-SECRET": secret,
        },
      },
    });
    cached = new PlaidApi(configuration);
  }
  return cached;
}

export function isPlaidConfigured(): boolean {
  return Boolean(
    process.env.PLAID_CLIENT_ID?.trim() && getPlaidSecret(),
  );
}
