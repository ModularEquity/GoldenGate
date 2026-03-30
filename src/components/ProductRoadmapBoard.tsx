"use client";

import { useCallback, useEffect, useState } from "react";

type Column = "BACKLOG" | "IN_PROGRESS" | "DONE";

type Item = {
  id: string;
  column: Column;
  title: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  createdBy: { email: string | null; name: string | null } | null;
};

const COL_LABEL: Record<Column, string> = {
  BACKLOG: "Backlog",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export function ProductRoadmapBoard() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setErr(null);
    const res = await fetch("/api/roadmap");
    const data = (await res.json()) as { items?: Item[]; error?: string };
    if (!res.ok) {
      setErr(data.error ?? "Could not load roadmap");
      setItems([]);
      return;
    }
    setItems(data.items ?? []);
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  async function submitRequest(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setErr(null);
    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setErr(data.error ?? "Could not submit");
        return;
      }
      setTitle("");
      setDescription("");
      await load();
    } finally {
      setSubmitting(false);
    }
  }

  async function moveColumn(id: string, column: Column) {
    setErr(null);
    const res = await fetch(`/api/roadmap/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ column }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok) {
      setErr(data.error ?? "Could not update card");
      return;
    }
    await load();
  }

  const byCol = (c: Column) => items.filter((i) => i.column === c);

  return (
    <div className="space-y-10">
      <form
        onSubmit={submitRequest}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-semibold text-foreground">Submit a request</h2>
        <p className="mt-1 text-sm text-muted">
          Ideas land in <strong className="text-foreground">Backlog</strong>. Team
          can move cards across the board.
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <label htmlFor="rm-title" className="text-sm font-medium">
              Title *
            </label>
            <input
              id="rm-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              maxLength={200}
              required
              placeholder="e.g. Export subscriptions to CSV"
            />
          </div>
          <div>
            <label htmlFor="rm-desc" className="text-sm font-medium">
              Details (optional)
            </label>
            <textarea
              id="rm-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              placeholder="Context, priority, links…"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Adding…" : "Add to backlog"}
        </button>
      </form>

      {err ? (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {err}
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted">Loading board…</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {(["BACKLOG", "IN_PROGRESS", "DONE"] as const).map((col) => (
            <section
              key={col}
              className="flex min-h-[280px] flex-col rounded-xl border border-border bg-muted/30 p-4"
            >
              <h3 className="border-b border-border pb-2 text-sm font-semibold uppercase tracking-wide text-muted">
                {COL_LABEL[col]}
              </h3>
              <ul className="mt-3 flex flex-1 flex-col gap-3">
                {byCol(col).map((item) => (
                  <li
                    key={item.id}
                    className="rounded-lg border border-border bg-card p-3 shadow-sm"
                  >
                    <p className="font-medium text-foreground">{item.title}</p>
                    {item.description ? (
                      <p className="mt-2 whitespace-pre-wrap text-xs text-muted">
                        {item.description}
                      </p>
                    ) : null}
                    <p className="mt-2 text-[10px] text-muted">
                      {item.createdBy?.email ?? "System"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {(["BACKLOG", "IN_PROGRESS", "DONE"] as const).map((c) =>
                        c === col ? null : (
                          <button
                            key={c}
                            type="button"
                            onClick={() => moveColumn(item.id, c)}
                            className="rounded border border-border bg-background px-2 py-1 text-[10px] text-muted hover:border-accent hover:text-accent"
                          >
                            → {COL_LABEL[c]}
                          </button>
                        ),
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
