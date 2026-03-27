"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePlaidLink } from "react-plaid-link";
import { useRouter } from "next/navigation";

export function PlaidLinkButton() {
  const router = useRouter();
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const shouldOpen = useRef(false);

  const onSuccess = useCallback(
    async (public_token: string) => {
      setMsg(null);
      const res = await fetch("/api/plaid/exchange-public-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_token }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setMsg(data.error ?? "Could not save bank link.");
        return;
      }
      setLinkToken(null);
      shouldOpen.current = false;
      router.refresh();
    },
    [router],
  );

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess,
    onExit: () => {
      shouldOpen.current = false;
      setLinkToken(null);
    },
  });

  useEffect(() => {
    if (linkToken && ready && shouldOpen.current) {
      shouldOpen.current = false;
      open();
    }
  }, [linkToken, ready, open]);

  async function startLink() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/plaid/create-link-token", { method: "POST" });
      const data = (await res.json()) as {
        link_token?: string;
        error?: string;
        code?: string;
      };
      if (!res.ok) {
        if (data.code === "PLAID_NOT_CONFIGURED") {
          setMsg(
            "Plaid is not configured. Add PLAID_CLIENT_ID and PLAID_API_SECRET (or PLAID_SECRET) in Vercel. Use PLAID_ENV=sandbox or production.",
          );
          return;
        }
        setMsg(data.error ?? "Could not start Plaid.");
        return;
      }
      if (data.link_token) {
        shouldOpen.current = true;
        setLinkToken(data.link_token);
      }
    } catch {
      setMsg("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={startLink}
        disabled={loading}
        className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Starting…" : "Link bank account (Plaid)"}
      </button>
      {msg ? <p className="text-sm text-red-400">{msg}</p> : null}
    </div>
  );
}
