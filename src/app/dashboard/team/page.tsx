import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata = {
  title: "Team — Modular Equity",
};

/** Employee-only area — extend with admin tools, approvals, etc. */
export default async function TeamPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "EMPLOYEE") {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-sm text-muted hover:text-accent">
          ← Investor hub
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Team & operations
        </h1>
        <p className="mt-2 text-muted">
          Employee-only area. Wire investor support, compliance review, and
          internal workflows here as we build them.
        </p>
      </div>
      <div className="rounded-xl border border-accent/40 bg-card p-6">
        <p className="text-sm text-muted">
          You are signed in as <strong>{session.user.email}</strong> with{" "}
          <strong>Employee</strong> permissions.
        </p>
        <div className="mt-4">
          <Link
            href="/dashboard/team/deals/new"
            className="font-medium text-accent hover:underline"
          >
            Add a new deal →
          </Link>
        </div>
      </div>
    </div>
  );
}
