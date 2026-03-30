export type DashboardNavLink = {
  href: string;
  label: string;
};

export type DashboardNavSection = {
  id: string;
  title: string;
  description: string;
  links: DashboardNavLink[];
};

/** Primary investor navigation — used by the dashboard sidebar ribbon */
export const DASHBOARD_NAV_SECTIONS: DashboardNavSection[] = [
  {
    id: "onboarding",
    title: "1 · Onboarding & compliance",
    description:
      "Register your investor account, questionnaire, PPM, risk disclosures, tax forms, and wire/ACH instructions (DocSign).",
    links: [
      { href: "/dashboard/onboarding", label: "Investor onboarding overview" },
      {
        href: "/dashboard/onboarding/register",
        label: "Register investor account",
      },
      { href: "/dashboard/onboarding/ppm-risk", label: "PPM & risk disclosures" },
      { href: "/dashboard/onboarding/tax", label: "W-9 / W-8 tax forms" },
      { href: "/dashboard/onboarding/banking", label: "Wire / ACH & banking" },
    ],
  },
  {
    id: "documents",
    title: "2 · Documents (read-only)",
    description: "Operating agreement and cap table visibility.",
    links: [
      { href: "/dashboard/documents", label: "Operating documents" },
      { href: "/dashboard/documents#cap-table", label: "Cap table" },
    ],
  },
  {
    id: "deals",
    title: "3 · Deals",
    description: "Review fix-and-flip and renovation opportunities.",
    links: [{ href: "/dashboard/deals", label: "Deal room & review" }],
  },
  {
    id: "subscribe",
    title: "4 · Subscribe & fund",
    description: "Execute subscription documents and fund via ACH.",
    links: [
      { href: "/dashboard/subscribe", label: "Subscribe to a deal" },
      { href: "/dashboard/fund", label: "Bank accounts & funding" },
    ],
  },
];

export const DASHBOARD_UTILITY_LINKS: DashboardNavLink[] = [
  { href: "/dashboard", label: "Hub home" },
  { href: "/dashboard/faq", label: "FAQ" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/contact", label: "Contact" },
  { href: "/dashboard/roadmap", label: "Product roadmap" },
  { href: "/dashboard/technical-catalogue", label: "Technical catalogue" },
];

export const EMPLOYEE_NAV_LINKS: DashboardNavLink[] = [
  { href: "/dashboard/team", label: "Team & operations" },
  { href: "/dashboard/team/deals/new", label: "Add a new deal" },
  { href: "/dashboard/team/deals/import", label: "Import deals (CSV)" },
];

/** Shown for Deal Sourcer (same deal tools, focused hub) */
export const DEAL_SOURCER_NAV_LINKS: DashboardNavLink[] = [
  { href: "/dashboard/team", label: "Deal sourcing hub" },
  { href: "/dashboard/team/deals/new", label: "Add a new deal" },
  { href: "/dashboard/team/deals/import", label: "Import deals (CSV)" },
];
