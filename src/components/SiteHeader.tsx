import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/LogoutButton";

/**
 * Top bar: brand + Dashboard (when signed in) + Login or Sign out.
 * Deeper navigation stays in the dashboard left ribbon.
 */
export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-accent">
          Modular Equity
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="text-foreground hover:text-accent transition-colors"
              >
                Dashboard
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-border bg-card px-3 py-1.5 text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
