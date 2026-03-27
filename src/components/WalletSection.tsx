"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Wallet = {
  id: string;
  label: string;
  address: string;
  chain: string | null;
  createdAt: string;
};

export function WalletSection({ initialWallets }: { initialWallets: Wallet[] }) {
  const router = useRouter();
  const [wallets, setWallets] = useState(initialWallets);
  const [label, setLabel] = useState("");
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function addWallet(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/wallets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, address, chain: chain || undefined }),
      });
      const data = (await res.json()) as { wallet?: Wallet; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not save wallet.");
        return;
      }
      if (data.wallet) {
        setWallets((w) => [data.wallet!, ...w]);
        setLabel("");
        setAddress("");
        setChain("");
        router.refresh();
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={addWallet}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-medium text-foreground">Add a wallet</h2>
        <p className="mt-1 text-sm text-muted">
          Store a wallet address for distributions or on-chain references
          (not custodial — you control the keys).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="w-label" className="text-sm font-medium">
              Label
            </label>
            <input
              id="w-label"
              required
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Main ETH wallet"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="w-chain" className="text-sm font-medium">
              Chain (optional)
            </label>
            <input
              id="w-chain"
              value={chain}
              onChange={(e) => setChain(e.target.value)}
              placeholder="e.g. Ethereum"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <label htmlFor="w-address" className="text-sm font-medium">
            Wallet address
          </label>
          <input
            id="w-address"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x… or other address format"
            className="w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-sm"
          />
        </div>
        {error ? (
          <p className="mt-2 text-sm text-red-400">{error}</p>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 rounded-md border border-border px-4 py-2 text-sm hover:border-accent disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save wallet"}
        </button>
      </form>

      {wallets.length > 0 ? (
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-medium text-foreground">Your wallets</h3>
          <ul className="mt-3 space-y-3">
            {wallets.map((w) => (
              <li
                key={w.id}
                className="rounded-md border border-border/60 bg-background/50 p-3 text-sm"
              >
                <div className="font-medium text-foreground">{w.label}</div>
                {w.chain ? (
                  <div className="text-xs text-muted">{w.chain}</div>
                ) : null}
                <div className="mt-1 break-all font-mono text-xs text-muted">
                  {w.address}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
