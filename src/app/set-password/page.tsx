import { Suspense } from "react";
import { SetPasswordForm } from "@/components/SetPasswordForm";

export const metadata = {
  title: "Set password — GoldenGate",
  description: "Create your investor account password.",
};

export default function SetPasswordPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Suspense
        fallback={
          <p className="text-muted text-sm">Loading secure setup…</p>
        }
      >
        <SetPasswordForm />
      </Suspense>
    </div>
  );
}
