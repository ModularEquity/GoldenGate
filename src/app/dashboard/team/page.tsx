import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { canAccessTeamHub, canManageDeals } from "@/lib/deal-roles";

export const metadata = {
  title: "Team — Modular Equity",
};

export default async function TeamPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const role = session.user.role;
  const isEmployee = role === "EMPLOYEE";
  const isDealSourcer = role === "DEAL_SOURCER";

  if (!canAccessTeamHub(session.user.role) && !isDealSourcer) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm text-muted hover:text-accent">
          ← Investor hub
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          {isDealSourcer && !isEmployee
            ? "Deal sourcing hub"
            : "Team & operations"}
        </h1>
        <p className="mt-2 text-muted">
          {isDealSourcer && !isEmployee
            ? "Source renovation and new-build opportunities, upload deal stats (CSV or web form), and edit deals with full audit history."
            : "Employee area — operations, compliance, and internal workflows."}
        </p>
      </div>
      <div className="rounded-xl border border-accent/40 bg-card p-6">
        <p className="text-sm text-muted">
          Signed in as <strong>{session.user.email}</strong> —{" "}
          <strong>
            {isEmployee ? "Employee" : isDealSourcer ? "Deal Sourcer" : role}
          </strong>
          .
        </p>
        {canManageDeals(role) ? (
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link
                href="/dashboard/team/deals/new"
                className="font-medium text-accent hover:underline"
              >
                Add a new deal →
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/team/deals/import"
                className="font-medium text-accent hover:underline"
              >
                Import deals (CSV) →
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/deals"
                className="text-accent hover:underline"
              >
                Deal room (review & edit any deal) →
              </Link>
            </li>
          </ul>
        ) : null}
      </div>
    </div>
  );
}
