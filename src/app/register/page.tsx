import { RegisterEmailForm } from "@/components/RegisterEmailForm";

export const metadata = {
  title: "Register — GoldenGate",
  description: "Join the investor list with your email.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create your investor profile
        </h1>
        <p className="text-muted">
          Step 1: register with any email. We&apos;ll use this for deal updates
          and onboarding (DocSign, Plaid, and bank linking come next).
        </p>
      </div>

      <RegisterEmailForm />
    </div>
  );
}
