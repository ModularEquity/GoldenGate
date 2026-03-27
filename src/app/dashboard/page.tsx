import { redirect } from "next/navigation";
import { getSessionFromCookies } from "@/lib/auth-session";

export const metadata = {
  title: "Dashboard — GoldenGate",
  description: "Your investor dashboard.",
};

export default async function DashboardPage() {
  const session = await getSessionFromCookies();
  if (!session) {
    redirect("/register");
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted">
          Signed in as <span className="text-foreground">{session.email}</span>
        </p>
      </div>

      <section className="rounded-xl border border-dashed border-border bg-card/50 p-6">
        <h2 className="font-medium text-foreground">Welcome packet & registration</h2>
        <p className="mt-2 text-sm text-muted">
          Your investor packet (PPM, risk disclosures, wire/ACH instructions)
          will appear here as DocSign and document workflows are connected.
          Next steps: complete accreditation questionnaire and review open
          renovation deals.
        </p>
      </section>
    </div>
  );
}
