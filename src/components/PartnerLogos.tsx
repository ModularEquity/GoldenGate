import Image from "next/image";

const partners = [
  { name: "Vercel", href: "https://vercel.com", src: "/partners/vercel.svg", w: 90, h: 24 },
  { name: "GitHub", href: "https://github.com", src: "/partners/github.svg", w: 90, h: 24 },
  { name: "Stripe", href: "https://stripe.com", src: "/partners/stripe.svg", w: 100, h: 32 },
  { name: "Mercury", href: "https://mercury.com", src: "/partners/mercury.svg", w: 120, h: 32 },
  {
    name: "QuickBooks",
    href: "https://quickbooks.intuit.com",
    src: "/partners/quickbooks.svg",
    w: 100,
    h: 28,
  },
] as const;

function LogoRow() {
  return (
    <ul className="flex w-max items-center gap-10 px-4">
      {partners.map((p) => (
        <li key={p.name}>
          <a
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-16 w-[140px] shrink-0 items-center justify-center rounded-lg border border-border/60 bg-white px-3 py-2 shadow-sm transition hover:border-accent/50 hover:shadow-md dark:bg-zinc-900"
          >
            <Image
              src={p.src}
              alt={p.name}
              width={p.w}
              height={p.h}
              className="h-8 w-auto max-w-[120px] object-contain object-center"
            />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PartnerLogos() {
  return (
    <section
      aria-labelledby="partners-heading"
      className="overflow-hidden rounded-xl border border-border bg-card py-8"
    >
      <h2
        id="partners-heading"
        className="text-center text-sm font-semibold uppercase tracking-widest text-muted"
      >
        Integration partners
      </h2>
      <p className="mx-auto mt-2 max-w-xl px-4 text-center text-sm text-muted">
        Tools we use to deliver infrastructure, banking, and accounting workflows.
      </p>

      <div className="relative mt-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-card to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-card to-transparent" />

        <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="animate-partner-marquee flex min-w-full shrink-0 items-center">
            <LogoRow />
            <LogoRow />
          </div>
        </div>
      </div>
    </section>
  );
}
