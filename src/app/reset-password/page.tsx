import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/ResetPasswordForm";

export const metadata = {
  title: "New password — Modular Equity",
  description: "Set a new password from your reset link.",
};

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Suspense fallback={<p className="text-sm text-muted">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
