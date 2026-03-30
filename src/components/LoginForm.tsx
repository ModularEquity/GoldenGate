"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setStatus("loading");
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setStatus("error");
        setMessage("Invalid email or password.");
        return;
      }

      setStatus("idle");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Could not sign in. Try again.");
    }
  }

  async function signInWithGoogle() {
    setMessage("");
    setStatus("loading");
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6 rounded-xl border border-border bg-card p-6"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="text-sm text-muted">
          Use your email and password, or continue with Google.
        </p>
      </div>

      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={status === "loading"}
        className="w-full rounded-md border border-border bg-background py-2.5 text-sm font-medium text-foreground hover:border-accent hover:text-accent disabled:opacity-50"
      >
        Continue with Google
      </button>
      <p className="text-center text-xs text-muted">
        <Link href="/help/google-signin" className="text-accent hover:underline">
          Google sign-in error (redirect_uri)?
        </Link>
      </p>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted">Or</span>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="login-email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-accent focus:ring-2"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <label htmlFor="login-password" className="block text-sm font-medium">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs text-accent hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-accent focus:ring-2"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-md bg-accent py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {status === "loading" ? "Signing in…" : "Sign in"}
      </button>

      {message ? (
        <p role="alert" className="text-sm text-red-400">
          {message}
        </p>
      ) : null}

      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/register" className="text-accent hover:underline">
          Register your email
        </Link>
      </p>
    </form>
  );
}
