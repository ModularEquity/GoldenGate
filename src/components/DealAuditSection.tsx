"use client";

import { useCallback, useEffect, useState } from "react";

type Entry = {
  id: string;
  field: string;
  oldValue: string | null;
  newValue: string | null;
  createdAt: string;
  actorEmail: string | null;
  actorName: string | null;
};

export function DealAuditSection({ dealSlug }: { dealSlug: string }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/deals/${dealSlug}/audit`);
    const data = (await res.json()) as { entries?: Entry[] };
    if (res.ok && data.entries) setEntries(data.entries);
    setLoading(false);
  }, [dealSlug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold text-foreground">Change history</h2>
        <p className="mt-2 text-sm text-muted">Loading…</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Change history</h2>
      <p className="mt-2 text-sm text-muted">
        Every field change is logged with <strong className="text-foreground">who</strong>{" "}
        and <strong className="text-foreground">when</strong> for transparency.
      </p>
      <div className="mt-4 max-h-96 overflow-y-auto rounded-lg border border-border">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="sticky top-0 bg-background/95">
            <tr className="border-b border-border">
              <th className="px-3 py-2 font-medium">Time (UTC)</th>
              <th className="px-3 py-2 font-medium">User</th>
              <th className="px-3 py-2 font-medium">Field</th>
              <th className="px-3 py-2 font-medium">From</th>
              <th className="px-3 py-2 font-medium">To</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-border/60 hover:bg-muted/30">
                <td className="whitespace-nowrap px-3 py-2 text-muted">
                  {new Date(e.createdAt).toISOString().replace("T", " ").slice(0, 19)}
                </td>
                <td className="px-3 py-2 text-foreground">
                  {e.actorName || e.actorEmail || "—"}
                </td>
                <td className="font-mono px-3 py-2 text-muted">{e.field}</td>
                <td className="max-w-[180px] truncate px-3 py-2 text-muted" title={e.oldValue ?? ""}>
                  {e.field === "__created__" ? "—" : (e.oldValue ?? "—")}
                </td>
                <td className="max-w-[180px] truncate px-3 py-2 text-muted" title={e.newValue ?? ""}>
                  {e.newValue ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {entries.length === 0 ? (
        <p className="mt-3 text-sm text-muted">No changes recorded yet.</p>
      ) : null}
    </section>
  );
}
