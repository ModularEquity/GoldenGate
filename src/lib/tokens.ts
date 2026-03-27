import { createHash, randomBytes } from "crypto";

/** URL-safe token for magic links (stored hashed in DB). */
export function generateRawToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}
