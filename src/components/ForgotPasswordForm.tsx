"use client";

import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setStatus("loading");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; message?: string };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong.");
        return;
      }

      setDone(true);
      setMessage(
        data.message ??
          "If an account exists for that email, we sent a password reset link.",
      );
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (done) {
    return (
      <div className="space-y-4 rounded-xl border border-border bg-card p-6">
        <h1 className="text-xl font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted">{message}</p>
        <Link
          href="/login"
          className="inline-block text-sm text-accent hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-xl border border-border bg-card p-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset password
        </h1>
        <p className="text-sm text-muted">
          We&apos;ll email you a link to choose a new password. The link expires
          in 24 hours.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="forgot-email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="forgot-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-accent focus:ring-2"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Send reset link"}
      </button>

      {message && status === "error" ? (
        <p role="alert" className="text-sm text-red-400">
          {message}
        </p>
      ) : null}

      <p className="text-center text-sm text-muted">
        <Link href="/login" className="text-accent hover:underline">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
