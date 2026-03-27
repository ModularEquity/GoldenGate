import type { UserRole } from "@prisma/client";

export function roleFromEmail(email: string | null | undefined): UserRole {
  if (!email) return "INVESTOR";
  const domain = email.split("@")[1]?.toLowerCase() ?? "";
  if (domain === "modularequity.com") return "EMPLOYEE";
  return "INVESTOR";
}
