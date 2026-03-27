import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { FaqAccordion } from "@/components/FaqAccordion";

export const metadata = {
  title: "FAQ — Modular Equity",
};

const toc = [
  { id: "getting-started", label: "Getting started" },
  { id: "onboarding", label: "Onboarding & documents" },
  { id: "deals-funding", label: "Deals & funding" },
  { id: "bank-wallet", label: "Bank link & wallets" },
  { id: "security", label: "Security & compliance" },
];

const faqSections: {
  tocId: string;
  title: string;
  items: { id: string; question: string; answer: ReactNode }[];
}[] = [
  {
    tocId: "getting-started",
    title: "Getting started",
    items: [
      {
        id: "gs-1",
        question: "How do I create an account?",
        answer:
          "Use Register with Google or enter your email. With email, you’ll receive a link to set your password. Then sign in from Login (Google or password) to open your dashboard.",
      },
      {
        id: "gs-2",
        question: "I forgot my password — what should I do?",
        answer:
          "Use Forgot password on the login page. We’ll email you a secure link to choose a new password (valid 24 hours).",
      },
    ],
  },
  {
    tocId: "onboarding",
    title: "Onboarding & documents",
    items: [
      {
        id: "ob-1",
        question: "Where is the PPM and risk disclosures?",
        answer:
          "From the dashboard, open Investor onboarding or Documents. Direct Google Doc links are also listed on those pages for quick access.",
      },
      {
        id: "ob-2",
        question: "What about W-9 / W-8 tax forms?",
        answer:
          "Tax collection will be completed through our DocSign workflow. The onboarding section describes the steps; e-sign integration is in progress.",
      },
      {
        id: "ob-3",
        question: "Where is the operating agreement?",
        answer:
          "See Documents → Operating documents, or use the Google Drive link provided there. Content is read-only for investors.",
      },
    ],
  },
  {
    tocId: "deals-funding",
    title: "Deals & funding",
    items: [
      {
        id: "df-1",
        question: "How do I review an investment opportunity?",
        answer:
          "Open Deal room from the dashboard to see fix-and-flip and renovation materials. Additional materials may live in the shared Deal Room Google Drive folder.",
      },
      {
        id: "df-2",
        question: "How does funding work?",
        answer:
          "After subscribing to a deal (DocSign), you can record a funding request on the Fund page. Link a bank account with Plaid first. Live ACH debits require Plaid Transfer or Stripe — we log commitments for operations today.",
      },
      {
        id: "df-3",
        question: "Can I schedule automatic debits?",
        answer:
          "Auto-debit on a specified day is on the roadmap and will use the same bank link once ACH is fully enabled in production.",
      },
    ],
  },
  {
    tocId: "bank-wallet",
    title: "Bank link & wallets",
    items: [
      {
        id: "bw-1",
        question: "Why link my bank with Plaid?",
        answer:
          "Plaid lets us verify account ownership and prepare ACH funding securely. We use industry-standard tokenization — we don’t store your bank password.",
      },
      {
        id: "bw-2",
        question: "What is “Add a wallet”?",
        answer:
          "You can save a crypto wallet address (e.g. for future distributions or on-chain references). Modular Equity does not custody assets; you control your keys.",
      },
    ],
  },
  {
    tocId: "security",
    title: "Security & compliance",
    items: [
      {
        id: "sc-1",
        question: "Is this an offer to sell securities?",
        answer:
          "Information on this site is not an offer to sell or a solicitation in any jurisdiction where prohibited. Offers are made only through definitive documents and to qualified investors as applicable.",
      },
      {
        id: "sc-2",
        question: "Who do I contact for support?",
        answer:
          "Reach out to your sponsor at Modular Equity or the email shown in your onboarding materials.",
      },
    ],
  },
];

export default async function FaqPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-10">
      <div>
        <Link href="/dashboard" className="text-sm text-muted hover:text-accent">
          ← Investor hub
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Frequently asked questions
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          Answers for investors using Modular Equity. For legal terms, rely on your
          signed subscription documents and the PPM.
        </p>
      </div>

      <nav
        aria-label="Table of contents"
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
          On this page
        </h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
          {toc.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="text-accent hover:underline">
                {t.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {faqSections.map((section) => (
        <section key={section.tocId} id={section.tocId} className="scroll-mt-24">
          <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
          <div className="mt-4">
            <FaqAccordion
              items={section.items.map((i) => ({
                id: i.id,
                question: i.question,
                answer: <p>{i.answer}</p>,
              }))}
            />
          </div>
        </section>
      ))}
    </div>
  );
}
