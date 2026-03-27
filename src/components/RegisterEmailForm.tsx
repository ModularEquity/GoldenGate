"use client";

import { useState } from "react";

export function RegisterEmailForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("idle");
    setMessage("");

    try {
      const res = await fetch("/api/register-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setStatus("success");
      setMessage("Thanks — we’ve recorded your email. Next: full investor onboarding.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-xl border border-border bg-card p-6"
    >
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com or you@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted outline-none ring-accent focus:ring-2"
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-muted">
        <input
          type="checkbox"
          required
          className="mt-1 size-4 rounded border-border accent-accent"
        />
        <span>
          I understand this is not an offer to sell securities and that
          additional steps (accreditation, documents, and funding) apply.
        </span>
      </label>

      <button
        type="submit"
        className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-background hover:opacity-90"
      >
        Continue
      </button>

      {message ? (
        <p
          role="status"
          className={
            status === "success" ? "text-sm text-green-400" : "text-sm text-red-400"
          }
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
