import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { toDealListItem } from "@/lib/deals";
import { DealSubscribeAmountForm } from "@/components/DealSubscribeAmountForm";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const row = await prisma.deal.findUnique({ where: { slug } });
  return {
    title: row
      ? `Subscribe — ${row.name} — Modular Equity`
      : "Subscribe — Modular Equity",
  };
}

export default async function SubscribeDealPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { slug } = await params;
  const row = await prisma.deal.findUnique({
    where: { slug },
    include: {
      subscriptions: {
        where: { userId: session.user.id },
        take: 1,
      },
    },
  });

  if (!row || row.status !== "OPEN") notFound();

  const deal = toDealListItem(row);
  const existingCents = row.subscriptions[0]?.amountCents;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard/subscribe"
          className="text-sm text-muted hover:text-accent"
        >
          ← All deals
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Subscription amount
        </h1>
        <p className="mt-2 text-muted">
          Confirm how much you wish to subscribe for this offering.
        </p>
      </div>

      <DealSubscribeAmountForm
        deal={deal}
        initialAmountUsd={
          existingCents != null ? Math.floor(existingCents / 100) : undefined
        }
      />
    </div>
  );
}
