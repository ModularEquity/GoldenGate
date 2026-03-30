import Link from "next/link";
import { RegisterEmailForm } from "@/components/RegisterEmailForm";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { RegisterReferralCapture } from "@/components/RegisterReferralCapture";

export const metadata = {
  title: "Register — Modular Equity",
  description: "Join the investor list with your email.",
};

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-lg space-y-8">
      <RegisterReferralCapture />
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create your investor profile
        </h1>
        <p className="text-muted">
          Register with Google, or use any email. We&apos;ll send next steps for
          onboarding and DocSign.
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <p className="text-sm font-medium text-foreground">Register with Google</p>
        <p className="text-xs text-muted">
          <code className="rounded bg-background px-1">@modularequity.com</code>{" "}
          accounts are marked as <strong>Employee</strong> for staff permissions.
        </p>
        <GoogleSignInButton label="Register with Google" callbackUrl="/dashboard" />
        <p className="text-center text-xs text-muted">
          <Link href="/help/google-signin" className="text-accent hover:underline">
            Problem with Google sign-in? (redirect error)
          </Link>
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted">Or email</span>
        </div>
      </div>

      <RegisterEmailForm />

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
