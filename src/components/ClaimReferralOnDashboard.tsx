"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

const KEY = "modular_pending_referral";

function Inner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const fromQuery = searchParams.get("ref")?.trim();
    let fromStorage: string | null = null;
    try {
      fromStorage = sessionStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    const ref = (fromQuery || fromStorage || "").trim();
    if (!ref) return;
    done.current = true;

    void (async () => {
      try {
        await fetch("/api/claim-referral", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ref }),
        });
      } finally {
        try {
          sessionStorage.removeItem(KEY);
        } catch {
          /* ignore */
        }
        const url = new URL(window.location.href);
        url.searchParams.delete("ref");
        router.replace(url.pathname + url.search, { scroll: false });
      }
    })();
  }, [searchParams, router]);

  return null;
}

export function ClaimReferralOnDashboard() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
