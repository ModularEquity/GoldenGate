"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OnboardingStepId } from "@/lib/onboarding-status";

export function CompleteStepButton({
  step,
  complete,
  label = "Mark complete",
  disabled: disabledProp,
}: {
  step: OnboardingStepId;
  complete: boolean;
  label?: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (complete) {
    return (
      <p className="text-sm font-medium text-green-600 dark:text-green-400">
        ✓ Completed
      </p>
    );
  }

  const disabled = Boolean(disabledProp) || complete;

  async function onClick() {
    if (disabledProp) return;
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding/step", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step }),
      });
      if (!res.ok) {
        const d = (await res.json()) as { error?: string };
        setErr(d.error ?? "Could not save");
        return;
      }
      router.refresh();
    } catch {
      setErr("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={loading || disabled}
        className="inline-flex w-fit rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Saving…" : label}
      </button>
      {err ? <p className="text-sm text-red-500">{err}</p> : null}
    </div>
  );
}
