import { auth } from "@/auth";
import { HowItWorksTabs } from "@/components/HowItWorksTabs";
import { HomeHeroActions } from "@/components/HomeHeroActions";
import { PartnerLogos } from "@/components/PartnerLogos";

export default async function HomePage() {
  const session = await auth();
  const signedIn = Boolean(session?.user);

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
        <HomeHeroActions signedIn={signedIn} />
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <HowItWorksTabs />
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

      <PartnerLogos />
    </div>
  );
}
