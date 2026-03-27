"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DealListItem } from "@/lib/deals";
import {
  MIN_SUBSCRIPTION_USD,
  maxSubscriptionUsd,
} from "@/lib/subscription-rules";

function fmtUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function SubscribeDealsTable({ deals }: { deals: DealListItem[] }) {
  const router = useRouter();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  if (deals.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
        No open deals available for subscription right now.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-border bg-background/80">
          <tr>
            <th className="px-4 py-3 font-medium text-foreground">Subscribe</th>
            <th className="px-4 py-3 font-medium text-foreground">Deal</th>
            <th className="px-4 py-3 font-medium text-foreground">Location</th>
            <th className="px-4 py-3 font-medium text-foreground">Total cost</th>
            <th className="px-4 py-3 font-medium text-foreground">Min</th>
            <th className="px-4 py-3 font-medium text-foreground">Your cap</th>
            <th className="px-4 py-3 font-medium text-foreground" />
          </tr>
        </thead>
        <tbody>
          {deals.map((d) => {
            const cap = maxSubscriptionUsd(
              d.totalCostUsd,
              d.maxSubscriptionPctOfTotalCost,
            );
            return (
              <tr key={d.id} className="border-b border-border/50 last:border-0">
                <td className="px-4 py-3">
                  <input
                    type="radio"
                    name="deal-subscribe"
                    checked={selectedSlug === d.slug}
                    onChange={() => setSelectedSlug(d.slug)}
                    aria-label={`Select ${d.name}`}
                  />
                </td>
                <td className="px-4 py-3 font-medium text-foreground">
                  {d.name}
                </td>
                <td className="px-4 py-3 text-muted">
                  {d.city}, {d.state}
                </td>
                <td className="px-4 py-3 text-muted">{fmtUsd(d.totalCostUsd)}</td>
                <td className="px-4 py-3 text-muted">
                  {fmtUsd(MIN_SUBSCRIPTION_USD)}
                </td>
                <td className="px-4 py-3 text-muted">
                  {fmtUsd(cap)}{" "}
                  <span className="text-xs">
                    ({d.maxSubscriptionPctOfTotalCost}% of total)
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={selectedSlug !== d.slug}
                    onClick={() =>
                      router.push(`/dashboard/subscribe/${d.slug}`)
                    }
                    className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
