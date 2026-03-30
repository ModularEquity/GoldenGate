import Link from "next/link";
import { getContactEmail } from "@/lib/site-contact";

export const metadata = {
  title: "Contact — Modular Equity",
};

export default function ContactPage() {
  const email = getContactEmail();

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div>
        <Link href="/" className="text-sm text-muted hover:text-accent">
          ← Home
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Contact us</h1>
        <p className="mt-2 text-muted">
          Reach the Modular Equity team for investor support, partnerships, or
          general inquiries.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm font-medium text-foreground">Email</p>
        <a
          href={`mailto:${email}`}
          className="mt-2 inline-block text-lg text-accent hover:underline"
        >
          {email}
        </a>
        <p className="mt-4 text-sm text-muted">
          We aim to respond within two business days. For urgent matters, note
          your sponsor name or deal in the subject line.
        </p>
      </div>

      <p className="text-center text-sm text-muted">
        Already an investor?{" "}
        <Link href="/login" className="text-accent hover:underline">
          Sign in
        </Link>{" "}
        for dashboard, FAQ, and deals.
      </p>
    </div>
  );
}
