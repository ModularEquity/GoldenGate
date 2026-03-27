import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-session";

export const metadata = {
  title: "Onboarding — GoldenGate",
};

export default async function OnboardingPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/login");

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="text-sm text-muted hover:text-accent"
        >
          ← Investor hub
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Investor onboarding
        </h1>
        <p className="mt-2 text-muted">
          DocSign / questionnaire flows will be connected here.
        </p>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <h2 className="font-medium text-foreground">Register investor account</h2>
        <p className="text-sm text-muted">
          Legal entity profile, accreditation, and subscription eligibility —
          placeholder until DocSign integration.
        </p>
      </div>

      <div
        id="ppm"
        className="space-y-2 scroll-mt-24 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-medium text-foreground">PPM & risk disclosures</h2>
        <p className="text-sm text-muted">
          Private placement memorandum (read-only viewer) and risk disclosure
          acknowledgements (e-sign) — placeholder.
        </p>
      </div>

      <div
        id="tax"
        className="space-y-2 scroll-mt-24 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-medium text-foreground">Tax — W-9 / W-8</h2>
        <p className="text-sm text-muted">
          Collect W-9 (US) or W-8BEN / W-8BEN-E as applicable — placeholder.
        </p>
      </div>

      <div
        id="banking"
        className="space-y-2 scroll-mt-24 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-medium text-foreground">Wire / ACH instructions</h2>
        <p className="text-sm text-muted">
          Mercury-aligned funding instructions and acknowledgment — placeholder.
        </p>
      </div>
    </div>
  );
}
