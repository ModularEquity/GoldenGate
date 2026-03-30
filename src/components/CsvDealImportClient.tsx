"use client";

import { useState } from "react";

export function CsvDealImportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setErr("Choose a .csv file");
      return;
    }
    setErr(null);
    setResult(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/deals/import-csv", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as {
        imported?: number;
        failed?: number;
        results?: { row: number; slug?: string; error?: string }[];
        error?: string;
      };
      if (!res.ok) {
        setErr(data.error ?? "Import failed");
        return;
      }
      const lines = [
        `Imported: ${data.imported ?? 0}, Failed: ${data.failed ?? 0}`,
        ...(data.results?.filter((r) => r.error).map((r) => `Row ${r.row}: ${r.error}`) ?? []),
      ];
      setResult(lines.join("\n"));
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-border bg-card p-6"
    >
      <label className="block text-sm font-medium">CSV file</label>
      <input
        type="file"
        accept=".csv,text/csv"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="mt-2 block w-full text-sm"
      />
      <button
        type="submit"
        disabled={loading || !file}
        className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Importing…" : "Import"}
      </button>
      {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
      {result ? (
        <pre className="mt-4 whitespace-pre-wrap rounded bg-background p-3 text-xs text-muted">
          {result}
        </pre>
      ) : null}
    </form>
  );
}
