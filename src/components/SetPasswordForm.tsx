"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setStatus("error");
      setMessage("Missing link token. Use the link from your email.");
      return;
    }

    if (password !== confirm) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    if (password.length < 10) {
      setStatus("error");
      setMessage("Use at least 10 characters.");
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/auth/set-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        email?: string;
      };

      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Could not save password.");
        return;
      }

      if (data.email) {
        const si = await signIn("credentials", {
          email: data.email,
          password,
          redirect: false,
        });
        if (si?.error) {
          setStatus("error");
          setMessage("Password saved. Sign in from the login page.");
          return;
        }
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (!token) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-muted">
        <p className="font-medium text-foreground">Invalid or expired link</p>
        <p className="mt-2 text-sm">
          Open the link from your welcome email, or{" "}
          <a href="/register" className="text-accent underline">
            register your email again
          </a>
          .
        </p>
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
          Create your password
        </h1>
        <p className="text-sm text-muted">
          Choose a strong password for your investor account. You&apos;ll be
          taken to your dashboard next.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-accent focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm" className="block text-sm font-medium">
          Confirm password
        </label>
        <input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={10}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-accent focus:ring-2"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Saving…" : "Save password & continue"}
      </button>

      {message ? (
        <p role="alert" className="text-sm text-red-400">
          {message}
        </p>
      ) : null}
    </form>
  );
}
