import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-session";
import { INVESTOR_GOOGLE_DOCS } from "@/lib/investor-resources";

export const metadata = {
  title: "Onboarding — GoldenGate",
};

const docLinkClass =
  "inline-flex items-center gap-1 text-sm text-accent hover:underline";

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
          DocSign flows for questionnaire, tax, and wire/ACH forms will
          connect here. Below are quick links to Google Docs and Drive
          materials.
        </p>
      </div>

      <div className="rounded-xl border border-accent/30 bg-card p-6">
        <h2 className="font-medium text-foreground">Google Docs & Drive</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <a
              href={INVESTOR_GOOGLE_DOCS.ppm}
              target="_blank"
              rel="noopener noreferrer"
              className={docLinkClass}
            >
              PPM (Private Placement Memorandum) — Google Doc ↗
            </a>
          </li>
          <li>
            <a
              href={INVESTOR_GOOGLE_DOCS.riskDisclosures}
              target="_blank"
              rel="noopener noreferrer"
              className={docLinkClass}
            >
              Risk disclosures — Google Doc ↗
            </a>
          </li>
          <li>
            <a
              href={INVESTOR_GOOGLE_DOCS.dealRoomFolder}
              target="_blank"
              rel="noopener noreferrer"
              className={docLinkClass}
            >
              Deal room folder — Google Drive ↗
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-card p-6">
        <h2 className="font-medium text-foreground">Register investor account</h2>
        <p className="text-sm text-muted">
          Legal entity profile, accreditation, and subscription eligibility —
          DocSign placeholder.
        </p>
      </div>

      <div
        id="ppm"
        className="space-y-2 scroll-mt-24 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-medium text-foreground">PPM & risk (read / sign)</h2>
        <p className="text-sm text-muted">
          Review the PPM and risk disclosures. DocSign acknowledgements will be
          tracked here.
        </p>
        <a
          href={INVESTOR_GOOGLE_DOCS.ppm}
          target="_blank"
          rel="noopener noreferrer"
          className={docLinkClass}
        >
          Open PPM ↗
        </a>
        {" · "}
        <a
          href={INVESTOR_GOOGLE_DOCS.riskDisclosures}
          target="_blank"
          rel="noopener noreferrer"
          className={docLinkClass}
        >
          Open risk disclosures ↗
        </a>
      </div>

      <div
        id="tax"
        className="space-y-2 scroll-mt-24 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-medium text-foreground">Tax — W-9 / W-8BEN / W-8BEN-E</h2>
        <p className="text-sm text-muted">
          DocSign collection for US and non-US tax forms — placeholder.
        </p>
      </div>

      <div
        id="banking"
        className="space-y-2 scroll-mt-24 rounded-xl border border-border bg-card p-6"
      >
        <h2 className="font-medium text-foreground">
          Wire / ACH — routing, account, Plaid
        </h2>
        <p className="text-sm text-muted">
          Wire and ACH instructions (Mercury) and bank verification via Plaid.
          Save linked accounts on the{" "}
          <Link href="/dashboard/fund" className="text-accent hover:underline">
            Fund
          </Link>{" "}
          page after connecting Plaid.
        </p>
      </div>
    </div>
  );
}
