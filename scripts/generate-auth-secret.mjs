#!/usr/bin/env node
/**
 * Prints a random string suitable for AUTH_SECRET / NEXTAUTH_SECRET (≥32 chars).
 * Run once locally, copy the output into Vercel → Environment Variables → AUTH_SECRET.
 *
 * Do NOT generate a new secret on every deploy — that would log everyone out.
 */
import crypto from "node:crypto";

const secret = crypto.randomBytes(32).toString("base64url");
console.log(secret);
console.error(
  "\nPaste this value as AUTH_SECRET in Vercel (Production + Preview if needed), then redeploy.\n" +
    "Keep it separate from AUTH_GOOGLE_SECRET (Google OAuth client secret).\n",
);
