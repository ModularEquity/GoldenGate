import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/LogoutButton";
import { getContactEmail } from "@/lib/site-contact";

export async function SiteHeader() {
  const session = await auth();
  const isEmployee = session?.user?.role === "EMPLOYEE";
  const contactEmail = getContactEmail();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-accent">
          Modular Equity
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link
            href="/contact"
            className="hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <a
            href={`mailto:${contactEmail}`}
            className="hidden sm:inline hover:text-foreground transition-colors"
          >
            {contactEmail}
          </a>
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/faq"
                className="hover:text-foreground transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/dashboard/profile"
                className="hover:text-foreground transition-colors"
              >
                Profile
              </Link>
              {isEmployee ? (
                <Link
                  href="/dashboard/team"
                  className="hover:text-foreground transition-colors"
                >
                  Team
                </Link>
              ) : null}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md border border-border bg-card px-3 py-1.5 text-foreground hover:border-accent hover:text-accent transition-colors"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
