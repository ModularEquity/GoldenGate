import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ShareInviteLink } from "@/components/ShareInviteLink";
import { ensureUserReferralCode } from "@/lib/ensure-referral-code";
import { getPublicAppUrl } from "@/lib/app-url";

export const metadata = {
  title: "Profile — Modular Equity",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const code = await ensureUserReferralCode(session.user.id);
  const base = getPublicAppUrl();
  const shareUrl = `${base}/register?ref=${encodeURIComponent(code)}`;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <Link href="/dashboard" className="text-sm text-muted hover:text-accent">
          ← Investor hub
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mt-2 text-muted">
          Signed in as{" "}
          <span className="text-foreground">{session.user.email}</span>
        </p>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-semibold text-foreground">Share & invite</h2>
        <p className="mt-2 text-sm text-muted">
          One-click copy for your personal invite link. New users who register
          from this link include your referral code.
        </p>
        <div className="mt-4">
          <ShareInviteLink shareUrl={shareUrl} />
        </div>
        <p className="mt-3 text-xs text-muted">
          Referral code: <code className="rounded bg-background px-1">{code}</code>
        </p>
      </section>
    </div>
  );
}
