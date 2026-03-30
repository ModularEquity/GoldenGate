import Link from "next/link";

export function HomeHeroActions({ signedIn }: { signedIn: boolean }) {
  if (signedIn) {
    return (
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        Go to Dashboard
      </Link>
    );
  }

  return (
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
    </div>
  );
}
