"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

type Props = {
  label?: string;
  callbackUrl?: string;
};

export function GoogleSignInButton({
  label = "Continue with Google",
  callbackUrl = "/dashboard",
}: Props) {
  const [loading, setLoading] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        setLoading(true);
        signIn("google", { callbackUrl });
      }}
      disabled={loading}
      className="w-full rounded-md border border-border bg-background py-2.5 text-sm font-medium text-foreground hover:border-accent hover:text-accent disabled:opacity-50"
    >
      {loading ? "Redirecting…" : label}
    </button>
  );
}
