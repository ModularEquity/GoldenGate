"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type ManualBankRow = {
  id: string;
  nickname: string | null;
  institutionName: string;
  accountType: string;
  routingLast4: string;
  accountLast4: string;
  createdAt: string;
};

export function ManualBankSection({
  initialAccounts,
}: {
  initialAccounts: ManualBankRow[];
}) {
  const router = useRouter();
  const [accounts, setAccounts] = useState(initialAccounts);
  const [institutionName, setInstitutionName] = useState("");
  const [routingLast4, setRoutingLast4] = useState("");
  const [accountLast4, setAccountLast4] = useState("");
  const [nickname, setNickname] = useState("");
  const [accountType, setAccountType] = useState("checking");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/manual-bank", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          institutionName,
          routingLast4,
          accountLast4,
          nickname: nickname || undefined,
          accountType,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        account?: ManualBankRow;
      };
      if (!res.ok || !data.ok || !data.account) {
        setErr(data.error ?? "Could not save bank reference.");
        return;
      }
      setAccounts((prev) => [data.account!, ...prev]);
      setInstitutionName("");
      setRoutingLast4("");
      setAccountLast4("");
      setNickname("");
      setMsg("Bank reference saved (last 4 digits only).");
      router.refresh();
    } catch {
      setErr("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">
        Enter the <strong>last 4 digits</strong> of your routing and account numbers
        for operations reference. For verified ACH, use Plaid below.
      </p>

      <form
        onSubmit={submit}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="space-y-2 sm:col-span-2">
          <label htmlFor="mb-inst" className="text-sm font-medium">
            Bank / institution name
          </label>
          <input
            id="mb-inst"
            required
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="e.g. Chase"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="mb-routing" className="text-sm font-medium">
            Routing (last 4)
          </label>
          <input
            id="mb-routing"
            required
            inputMode="numeric"
            maxLength={4}
            value={routingLast4}
            onChange={(e) =>
              setRoutingLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="1234"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="mb-acct" className="text-sm font-medium">
            Account (last 4)
          </label>
          <input
            id="mb-acct"
            required
            inputMode="numeric"
            maxLength={4}
            value={accountLast4}
            onChange={(e) =>
              setAccountLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="5678"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="mb-type" className="text-sm font-medium">
            Account type
          </label>
          <select
            id="mb-type"
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="mb-nick" className="text-sm font-medium">
            Label (optional)
          </label>
          <input
            id="mb-nick"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            placeholder="Primary operating"
          />
        </div>
        <div className="flex items-end sm:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Save bank reference"}
          </button>
        </div>
      </form>

      {err ? <p className="text-sm text-red-500">{err}</p> : null}
      {msg ? <p className="text-sm text-green-600 dark:text-green-400">{msg}</p> : null}

      {accounts.length > 0 ? (
        <ul className="space-y-2 border-t border-border pt-4 text-sm">
          {accounts.map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-baseline justify-between gap-2 text-muted"
            >
              <span className="text-foreground">
                {a.nickname ? `${a.nickname} · ` : ""}
                {a.institutionName}
              </span>
              <span>
                ·•••{a.routingLast4} / ·•••{a.accountLast4} · {a.accountType}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
