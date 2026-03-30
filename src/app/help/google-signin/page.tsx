import Link from "next/link";

export const metadata = {
  title: "Google sign-in setup — Modular Equity",
  description:
    "Fix redirect_uri_mismatch and complete Google OAuth for Modular Equity.",
};

export default function GoogleSignInHelpPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link href="/register" className="text-sm text-muted hover:text-accent">
          ← Back to Register
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          Google sign-in: &quot;redirect_uri_mismatch&quot;
        </h1>
        <p className="mt-3 text-muted">
          Google compares the exact callback URL your app sends with the list in
          Google Cloud Console. If they don&apos;t match, you see{" "}
          <strong className="text-foreground">Error 400: redirect_uri_mismatch</strong>.
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground">1 · Add the callback in Google Cloud</h2>
        <p className="mt-2 text-sm text-muted">
          In{" "}
          <a
            href="https://console.cloud.google.com/apis/credentials"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            APIs &amp; Services → Credentials
          </a>
          , open your <strong className="text-foreground">OAuth 2.0 Client ID</strong>{" "}
          (Web application). Under <strong>Authorized redirect URIs</strong>, add{" "}
          <strong>every</strong> URL users might use:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
          <li>
            <code className="rounded bg-background px-1.5 py-0.5 text-foreground">
              https://modularequity.com/api/auth/callback/google
            </code>
          </li>
          <li>
            Your Vercel default host, e.g.{" "}
            <code className="rounded bg-background px-1.5 py-0.5 text-foreground">
              https://&lt;project&gt;.vercel.app/api/auth/callback/google
            </code>
          </li>
          <li>
            Local dev:{" "}
            <code className="rounded bg-background px-1.5 py-0.5 text-foreground">
              http://localhost:3000/api/auth/callback/google
            </code>
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted">
          Under <strong>Authorized JavaScript origins</strong>, add the same hosts
          without the path (e.g. <code className="rounded bg-background px-1">https://modularequity.com</code>).
        </p>
      </section>

      <section className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-6">
        <h2 className="font-semibold text-foreground">
          GoDaddy &quot;lander&quot; page (or `/lander` in the URL)?
        </h2>
        <p className="mt-2 text-sm text-muted">
          If you land on a <strong className="text-foreground">GoDaddy</strong> page with a URL like{" "}
          <code className="rounded bg-background px-1 text-foreground">
            .../lander?code=...&amp;scope=...
          </code>
          , that is <strong className="text-foreground">not</strong> from this app — we don&apos;t use{" "}
          <code className="rounded bg-background px-1">/lander</code>. Google sends the user to the{" "}
          <strong className="text-foreground">Authorized redirect URI</strong> you saved in Google Cloud.
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-muted">
          <li>
            <strong className="text-foreground">Wrong URI in Google:</strong> Remove any redirect URI that ends in{" "}
            <code className="rounded bg-background px-1">/lander</code> and add only{" "}
            <code className="rounded bg-background px-1">
              https://modularequity.com/api/auth/callback/google
            </code>{" "}
            (and your Vercel URL if needed).
          </li>
          <li>
            <strong className="text-foreground">DNS still at GoDaddy:</strong> If the domain doesn&apos;t point to
            Vercel yet, Google may hit a parking page instead of our app. Point the domain&apos;s DNS to Vercel and
            verify the domain in the Vercel dashboard until the site loads your dashboard, then retry Google sign-in.
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground">2 · Match Vercel to your public domain</h2>
        <p className="mt-2 text-sm text-muted">
          If people open{" "}
          <code className="rounded bg-background px-1">modularequity.com</code> but
          the app still builds OAuth links with a{" "}
          <code className="rounded bg-background px-1">*.vercel.app</code> host, Google
          will reject the request unless that preview URL is also listed.
        </p>
        <p className="mt-3 text-sm text-muted">
          In <strong>Vercel → Project → Settings → Environment Variables</strong>{" "}
          (Production), set <strong>one</strong> of these to your real site (no trailing slash):
        </p>
        <ul className="mt-2 list-inside list-disc text-sm text-muted">
          <li>
            <code className="text-foreground">AUTH_URL</code> ={" "}
            <code className="rounded bg-background px-1">https://modularequity.com</code>
          </li>
          <li>
            or <code className="text-foreground">NEXT_PUBLIC_APP_URL</code> with the same value
          </li>
        </ul>
        <p className="mt-3 text-sm text-muted">
          Redeploy after changing env vars. The app also prefers a custom domain over
          <code className="mx-1 rounded bg-background px-1">vercel.app</code> when both are present.
        </p>
      </section>

      <section className="rounded-xl border border-dashed border-border bg-card/80 p-6">
        <p className="text-sm text-muted">
          Developers: see <code className="rounded bg-background px-1">docs/google-oauth.md</code>{" "}
          in the repo for the full checklist.
        </p>
      </section>
    </div>
  );
}
