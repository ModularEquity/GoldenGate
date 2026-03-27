"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type PlaidAcc = {
  id: string;
  institutionName: string | null;
  mask: string | null;
  name: string | null;
  subtype: string | null;
};

type Intent = {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: string;
  note: string | null;
};

export function FundSection({
  plaidAccounts,
  intents,
}: {
  plaidAccounts: PlaidAcc[];
  intents: Intent[];
}) {
  const router = useRouter();
  const [dollars, setDollars] = useState("");
  const [plaidAccountId, setPlaidAccountId] = useState("");
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const amountCents = useMemo(() => {
    const n = parseFloat(dollars.replace(/,/g, ""));
    if (Number.isNaN(n) || n <= 0) return 0;
    return Math.round(n * 100);
  }, [dollars]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/funding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountCents,
          plaidAccountId: plaidAccountId || null,
          note: note || undefined,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        message?: string;
      };
      if (!res.ok || !data.ok) {
        setErr(data.error ?? "Could not record funding.");
        return;
      }
      setMsg(data.message ?? "Recorded.");
      setDollars("");
      setNote("");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={submit}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-medium text-foreground">Fund (ACH)</h2>
        <p className="mt-1 text-sm text-muted">
          Record a funding commitment. Live ACH pulls require Plaid Transfer or
          Stripe — this logs the intent for operations.
        </p>

        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="amt" className="text-sm font-medium">
              Amount (USD)
            </label>
            <input
              id="amt"
              type="text"
              inputMode="decimal"
              value={dollars}
              onChange={(e) => setDollars(e.target.value)}
              placeholder="1000.00"
              className="w-full max-w-xs rounded-md border border-border bg-background px-3 py-2"
            />
          </div>

          {plaidAccounts.length > 0 ? (
            <div className="space-y-2">
              <label htmlFor="bank" className="text-sm font-medium">
                Linked bank (optional)
              </label>
              <select
                id="bank"
                value={plaidAccountId}
                onChange={(e) => setPlaidAccountId(e.target.value)}
                className="w-full max-w-md rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">— None —</option>
                {plaidAccounts.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.institutionName ?? "Bank"}{" "}
                    {a.mask ? `·•••${a.mask}` : ""}{" "}
                    {a.name ? `(${a.name})` : ""}
                  </option>
                ))}
              </select>
            </div>
          ) : null}

          <div className="space-y-2">
            <label htmlFor="fnote" className="text-sm font-medium">
              Note (optional)
            </label>
            <input
              id="fnote"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Deal / reference"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>

        {err ? <p className="mt-2 text-sm text-red-400">{err}</p> : null}
        {msg ? <p className="mt-2 text-sm text-green-400">{msg}</p> : null}

        <button
          type="submit"
          disabled={loading || amountCents < 100}
          className="mt-4 rounded-md bg-accent px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit funding request"}
        </button>
      </form>

      {intents.length > 0 ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-medium text-foreground">Recent funding activity</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {intents.map((i) => (
              <li key={i.id} className="flex justify-between gap-4 border-b border-border/50 py-2 last:border-0">
                <span className="text-muted">
                  {new Date(i.createdAt).toLocaleString()}
                </span>
                <span className="text-foreground">
                  ${(i.amountCents / 100).toFixed(2)} {i.currency}{" "}
                  <span className="text-xs text-muted">({i.status})</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
