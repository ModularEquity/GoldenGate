import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-session";

export const metadata = {
  title: "Dashboard — GoldenGate",
  description: "Your investor dashboard.",
};

const sections = [
  {
    title: "1 · Onboarding & compliance",
    description:
      "Register your investor account, questionnaire, PPM, risk disclosures, tax forms, and wire/ACH instructions (DocSign).",
    links: [
      { href: "/dashboard/onboarding", label: "Investor onboarding & questionnaire" },
      { href: "/dashboard/onboarding#ppm", label: "PPM & risk disclosures" },
      { href: "/dashboard/onboarding#tax", label: "W-9 / W-8 tax forms" },
      { href: "/dashboard/onboarding#banking", label: "Wire / ACH instructions (Mercury)" },
    ],
  },
  {
    title: "2 · Documents (read-only)",
    description: "Operating agreement and cap table visibility.",
    links: [
      { href: "/dashboard/documents", label: "Operating documents" },
      { href: "/dashboard/documents#cap-table", label: "Cap table" },
    ],
  },
  {
    title: "3 · Deals",
    description: "Review fix-and-flip and renovation opportunities.",
    links: [{ href: "/dashboard/deals", label: "Deal room & review" }],
  },
  {
    title: "4 · Subscribe & fund",
    description: "Execute subscription documents and fund via ACH.",
    links: [
      { href: "/dashboard/subscribe", label: "Subscribe to a deal (DocSign)" },
      { href: "/dashboard/fund", label: "Fund deal — Plaid / ACH" },
    ],
  },
];

export default async function DashboardPage() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Investor hub</h1>
        <p className="mt-2 text-muted">
          Signed in as <span className="text-foreground">{session.email}</span>
        </p>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Follow the steps below to complete onboarding, review documents and
          deals, then subscribe and fund. Integrations (DocSign, Plaid, Mercury)
          will connect here as we wire production flows.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {sections.map((section) => (
          <section
            key={section.title}
            className="flex flex-col rounded-xl border border-border bg-card p-6"
          >
            <h2 className="font-semibold text-foreground">{section.title}</h2>
            <p className="mt-2 flex-1 text-sm text-muted">{section.description}</p>
            <ul className="mt-4 space-y-2">
              {section.links.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-accent hover:underline"
                  >
                    {link.label} →
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="rounded-xl border border-dashed border-border bg-background/50 p-6">
        <h2 className="font-medium text-foreground">Quick reference</h2>
        <p className="mt-2 text-sm text-muted">
          See <code className="rounded bg-card px-1 py-0.5 text-xs">AGENTS.md</code>{" "}
          in the repo for the full investor journey table. Need help? Contact
          your sponsor at Modular Equity.
        </p>
      </section>
    </div>
  );
}
