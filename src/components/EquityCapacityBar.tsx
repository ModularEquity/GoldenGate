"use client";

import type { EquityCapacityBreakdown } from "@/lib/deal-equity-capacity";

function fmtUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function EquityCapacityBar({
  dealName,
  breakdown,
}: {
  dealName: string;
  breakdown: EquityCapacityBreakdown;
}) {
  const { gpPct, lpPct, outstandingPct, gpUsd, maxLpUsd, lpSubscribedUsd, outstandingUsd, equityUsd } =
    breakdown;

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">
        Equity capacity & allocation
      </h2>
      <p className="mt-2 text-sm text-muted">
        <strong className="text-foreground">GP participation</strong> on{" "}
        <em>{dealName}</em>: <strong>{fmtUsd(gpUsd)}</strong> of{" "}
        {fmtUsd(equityUsd)} total equity ({fmtUsd(maxLpUsd)} available to LPs
        after GP).
      </p>

      <div
        className="relative mt-6 h-14 w-full overflow-hidden rounded-full border border-cyan-500/30 bg-slate-950/90 p-1 shadow-[0_0_24px_rgba(34,211,238,0.25),inset_0_1px_0_rgba(255,255,255,0.08)]"
        role="img"
        aria-label="Equity bar: GP, LP subscribed, outstanding"
      >
        <div className="flex h-full w-full overflow-hidden rounded-full">
          {gpPct > 0 ? (
            <div
              className="h-full bg-gradient-to-b from-fuchsia-400 via-fuchsia-600 to-purple-900 shadow-[0_0_18px_rgba(217,70,239,0.85)] transition-all duration-500"
              style={{ width: `${gpPct}%` }}
              title={`GP ${gpPct.toFixed(1)}%`}
            />
          ) : null}
          {lpPct > 0 ? (
            <div
              className="h-full bg-gradient-to-b from-cyan-300 via-sky-500 to-blue-900 shadow-[0_0_18px_rgba(34,211,238,0.9)] transition-all duration-500"
              style={{ width: `${lpPct}%` }}
              title={`LP subscribed ${lpPct.toFixed(1)}%`}
            />
          ) : null}
          {outstandingPct > 0 ? (
            <div
              className="h-full bg-gradient-to-b from-slate-800/40 to-slate-950/80"
              style={{ width: `${outstandingPct}%` }}
              title={`Open capacity ${outstandingPct.toFixed(1)}%`}
            />
          ) : null}
        </div>
        <div
          className="pointer-events-none absolute inset-0 rounded-full opacity-40"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 45%, rgba(0,0,0,0.2) 100%)",
          }}
        />
      </div>

      <ul className="mt-4 flex flex-wrap gap-4 text-xs">
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-sm bg-gradient-to-br from-fuchsia-400 to-purple-800 shadow-[0_0_8px_#d946ef]" />
          <span className="text-muted">
            GP <span className="font-medium text-foreground">{fmtUsd(gpUsd)}</span>
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-sm bg-gradient-to-br from-cyan-300 to-blue-800 shadow-[0_0_8px_#22d3ee]" />
          <span className="text-muted">
            LP subscribed{" "}
            <span className="font-medium text-foreground">{fmtUsd(lpSubscribedUsd)}</span>
          </span>
        </li>
        <li className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-sm border border-slate-600 bg-slate-900/80" />
          <span className="text-muted">
            LP capacity remaining{" "}
            <span className="font-medium text-foreground">{fmtUsd(outstandingUsd)}</span>
          </span>
        </li>
      </ul>
    </section>
  );
}
