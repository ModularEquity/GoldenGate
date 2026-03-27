import Link from "next/link";

type Props = {
  signInComplete: boolean;
  bankLinked: boolean;
  email: string;
};

export function OnboardingChecklist({
  signInComplete,
  bankLinked,
  email,
}: Props) {
  const steps: { done: boolean; label: string; href?: string }[] = [
    {
      done: true,
      label: "Account created",
    },
    {
      done: signInComplete,
      label: "Sign-in ready (password or Google)",
    },
    {
      done: bankLinked,
      label: "Bank account linked & verified (Plaid)",
      href: "/dashboard/fund",
    },
    {
      done: false,
      label: "Review onboarding docs & deals",
      href: "/dashboard/onboarding",
    },
  ];

  const completeCount = steps.filter((s) => s.done).length;

  return (
    <section className="rounded-xl border border-accent/30 bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-foreground">Your setup checklist</h2>
        <span className="text-xs text-muted">
          {completeCount}/{steps.length} started
        </span>
      </div>
      <p className="mt-1 text-sm text-muted">
        Signed in as <span className="text-foreground">{email}</span>
      </p>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={step.label} className="flex items-start gap-3 text-sm">
            <span
              className={
                step.done
                  ? "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white"
                  : "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-xs text-muted"
              }
              aria-hidden
            >
              {step.done ? "✓" : i + 1}
            </span>
            <div>
              {step.href && !step.done ? (
                <Link href={step.href} className="text-accent hover:underline">
                  {step.label}
                </Link>
              ) : (
                <span
                  className={
                    step.done ? "text-foreground" : "text-muted"
                  }
                >
                  {step.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
      {!bankLinked ? (
        <p className="mt-4 text-sm text-muted">
          Next:{" "}
          <Link href="/dashboard/fund" className="text-accent hover:underline">
            Link your bank with Plaid
          </Link>{" "}
          to verify account ownership for ACH funding.
        </p>
      ) : null}
    </section>
  );
}
