import type { UserRole } from "@prisma/client";

/** Can create deals, CSV import, edit deals, view audit log */
export function canManageDeals(role: UserRole | undefined): boolean {
  return role === "EMPLOYEE" || role === "DEAL_SOURCER";
}

/** Full employee team area (not all deal sourcers) */
export function canAccessTeamHub(role: UserRole | undefined): boolean {
  return role === "EMPLOYEE";
}
