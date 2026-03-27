import { randomBytes } from "node:crypto";

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** Short, URL-safe referral code (no ambiguous 0/O/1/I). */
export function generateReferralCode(length = 8): string {
  const bytes = randomBytes(length);
  let s = "";
  for (let i = 0; i < length; i++) {
    s += ALPHABET[bytes[i]! % ALPHABET.length];
  }
  return s;
}
