import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";

export const metadata = {
  title: "Reset password — GoldenGate",
  description: "Request a password reset link.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <ForgotPasswordForm />
    </div>
  );
}
