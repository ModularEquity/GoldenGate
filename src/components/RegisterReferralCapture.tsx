"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const KEY = "modular_pending_referral";

function Inner() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref")?.trim();
    if (ref) {
      try {
        sessionStorage.setItem(KEY, ref.toUpperCase());
      } catch {
        /* ignore */
      }
    }
  }, [searchParams]);

  return null;
}

export function RegisterReferralCapture() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
