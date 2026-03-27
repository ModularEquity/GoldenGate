import Image from "next/image";

/**
 * Partner logo tiles — Simple Icons CDN (SVG) where available; Mercury via Clearbit.
 */
const partners = [
  {
    name: "Vercel",
    href: "https://vercel.com",
    iconUrl: "https://cdn.simpleicons.org/vercel/000000",
    width: 40,
    height: 40,
  },
  {
    name: "GitHub",
    href: "https://github.com",
    iconUrl: "https://cdn.simpleicons.org/github/181717",
    width: 40,
    height: 40,
  },
  {
    name: "Plaid",
    href: "https://plaid.com",
    iconUrl: "https://cdn.simpleicons.org/plaid/000000",
    width: 40,
    height: 40,
  },
  {
    name: "Mercury",
    href: "https://mercury.com",
    /** Clearbit logo API — fallback if unavailable */
    iconUrl: "https://logo.clearbit.com/mercury.com",
    width: 120,
    height: 40,
  },
  {
    name: "QuickBooks",
    href: "https://quickbooks.intuit.com",
    iconUrl: "https://cdn.simpleicons.org/quickbooks/2CA01C",
    width: 40,
    height: 40,
  },
] as const;

export function PartnerLogos() {
  return (
    <section
      aria-labelledby="partners-heading"
      className="rounded-xl border border-border bg-card p-8"
    >
      <h2
        id="partners-heading"
        className="text-center text-sm font-semibold uppercase tracking-widest text-muted"
      >
        Integration partners
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted">
        Tools we use to deliver infrastructure, banking, and accounting workflows.
      </p>
      <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {partners.map((p) => (
          <li key={p.name}>
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full min-h-[120px] flex-col items-center justify-center gap-3 rounded-lg border border-border bg-background px-4 py-6 transition hover:border-accent/40 hover:shadow-sm"
            >
              <span className="flex h-12 w-full max-w-[140px] items-center justify-center">
                <Image
                  src={p.iconUrl}
                  alt=""
                  width={p.width}
                  height={p.height}
                  className="max-h-10 w-auto object-contain object-center"
                />
              </span>
              <span className="text-center text-xs font-medium text-foreground">
                {p.name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
