"use client";

import { useState } from "react";

export function ShareInviteLink({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function copy() {
    setErr(null);
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setErr("Could not copy — select the link and copy manually.");
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <input
          readOnly
          value={shareUrl}
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 font-mono text-sm"
          onFocus={(e) => e.target.select()}
        />
        <button
          type="button"
          onClick={copy}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
      {err ? <p className="text-xs text-red-500">{err}</p> : null}
      <p className="text-xs text-muted">
        Share this link so new investors land on registration with your referral
        attached. Set <code className="rounded bg-background px-1">NEXT_PUBLIC_APP_URL</code>{" "}
        in production for a stable domain.
      </p>
    </div>
  );
}
