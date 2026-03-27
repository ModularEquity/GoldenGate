import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DealForm } from "@/components/DealForm";

export const metadata = { title: "New deal — Modular Equity" };

export default async function NewDealPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "EMPLOYEE") {
    redirect("/dashboard");
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <Link href="/dashboard/team" className="text-sm text-muted hover:text-accent">
          ← Team
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Add deal
        </h1>
        <p className="mt-2 text-muted">
          Enter property URL — we fetch the Open Graph image for the tile
          thumbnail. All financial fields are stored and shown on the deal page.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <DealForm />
      </div>
    </div>
  );
}
