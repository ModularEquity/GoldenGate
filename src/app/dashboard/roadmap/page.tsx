import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ProductRoadmapBoard } from "@/components/ProductRoadmapBoard";

export const metadata = {
  title: "Product roadmap — Modular Equity",
  description: "Kanban-style roadmap; submit requests and track delivery.",
};

export default async function RoadmapPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-accent"
        >
          ← Dashboard
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Product roadmap
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Kanban view of what we&apos;re building. Submit requests to the{" "}
          <strong className="text-foreground">backlog</strong> — we&apos;re
          currently moving from Plaid toward{" "}
          <strong className="text-foreground">Stripe</strong> for payments and
          bank connections, with manual entry as fallback.
        </p>
      </div>

      <ProductRoadmapBoard />
    </div>
  );
}
