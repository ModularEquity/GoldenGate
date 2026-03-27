"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RefreshDealThumbnail({ slug }: { slug: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function refresh() {
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/deals/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshThumbnail: true }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setMsg(data.error ?? "Failed");
        return;
      }
      router.refresh();
      setMsg("Thumbnail updated.");
    } catch {
      setMsg("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={refresh}
        disabled={loading}
        className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-background disabled:opacity-50"
      >
        {loading ? "Refreshing…" : "Refresh listing thumbnail"}
      </button>
      {msg ? <span className="text-xs text-muted">{msg}</span> : null}
    </div>
  );
}
