import Link from "next/link";
import type { DealListItem } from "@/lib/deals";

export function DealCard({ deal }: { deal: DealListItem }) {
  const statusLabel =
    deal.status === "OPEN"
      ? "Open"
      : deal.status === "CLOSING"
        ? "Closing"
        : "Closed";

  return (
    <Link
      href={`/dashboard/deals/${deal.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition hover:border-accent/50 hover:shadow-md"
    >
      <div className="relative aspect-[16/10] w-full bg-muted">
        {deal.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- OG URLs from arbitrary listing domains
          <img
            src={deal.thumbnailUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            No image
          </div>
        )}
        <span className="absolute left-2 top-2 rounded bg-background/90 px-2 py-0.5 text-xs font-medium text-foreground">
          {statusLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h2 className="font-semibold text-foreground group-hover:text-accent">
          {deal.name}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {deal.city}, {deal.state}
        </p>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted">
          {deal.summary}
        </p>
        <span className="mt-4 text-sm font-medium text-accent">
          Open deal →
        </span>
      </div>
    </Link>
  );
}
