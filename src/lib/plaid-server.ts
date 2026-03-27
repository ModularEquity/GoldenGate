import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

function getBasePath(): string {
  const env = process.env.PLAID_ENV?.toLowerCase();
  if (env === "production") return PlaidEnvironments.production;
  return PlaidEnvironments.sandbox;
}

let client: PlaidApi | null = null;

export function getPlaidClient(): PlaidApi | null {
  const id = process.env.PLAID_CLIENT_ID?.trim();
  const secret = process.env.PLAID_SECRET?.trim();
  if (!id || !secret) return null;

  if (!client) {
    const configuration = new Configuration({
      basePath: getBasePath(),
      baseOptions: {
        headers: {
          "PLAID-CLIENT-ID": id,
          "PLAID-SECRET": secret,
        },
      },
    });
    client = new PlaidApi(configuration);
  }
  return client;
}

export function isPlaidConfigured(): boolean {
  return Boolean(
    process.env.PLAID_CLIENT_ID?.trim() && process.env.PLAID_SECRET?.trim(),
  );
}
