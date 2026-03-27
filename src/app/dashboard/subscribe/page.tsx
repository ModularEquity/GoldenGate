import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata = {
  title: "Subscribe — Modular Equity",
};

export default async function SubscribePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-accent"
        >
          ← Investor hub
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Subscribe to a deal
        </h1>
        <p className="mt-2 text-muted">
          Subscription agreement and investor representations — DocSign
          placeholder.
        </p>
      </div>

      <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted">
        After you review a deal in the deal room, you&apos;ll execute subscription
        documents here. No e-sign provider connected yet.
      </div>
    </div>
  );
}
