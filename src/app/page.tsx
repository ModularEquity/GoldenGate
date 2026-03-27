import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <p className="text-sm font-medium uppercase tracking-widest text-accent">
          Private equity · Real estate
        </p>
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          Capital for renovations that create lasting value.
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          Modular Equity partners with investors to fund fix-and-flip and renovation
          projects—disciplined underwriting, transparent reporting, and a
          streamlined path from interest to subscription.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            Register your email
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm text-foreground hover:border-accent hover:text-accent"
          >
            Login
          </Link>
          <a
            href="#process"
            className="inline-flex items-center justify-center rounded-md border border-border px-5 py-2.5 text-sm text-foreground hover:border-accent hover:text-accent"
          >
            How it works
          </a>
        </div>
      </section>

      <section
        id="process"
        className="grid gap-8 rounded-xl border border-border bg-card p-8 sm:grid-cols-3"
      >
        <div>
          <h2 className="font-medium text-foreground">Onboard</h2>
          <p className="mt-2 text-sm text-muted">
            Email signup, investor profile, and compliant document execution
            (PPM, risk, tax, wire/ACH).
          </p>
        </div>
        <div>
          <h2 className="font-medium text-foreground">Review</h2>
          <p className="mt-2 text-sm text-muted">
            Operating documents, cap table visibility, and deal rooms for each
            renovation opportunity.
          </p>
        </div>
        <div>
          <h2 className="font-medium text-foreground">Fund</h2>
          <p className="mt-2 text-sm text-muted">
            Subscribe via e-sign, then fund through linked bank (Plaid) with
            ACH or scheduled debit.
          </p>
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted">
        <p>
          Integrations: Vercel · GitHub · Plaid · Mercury — scaffold only;
          connect keys via environment when you wire production flows.
        </p>
      </section>
    </div>
  );
}
