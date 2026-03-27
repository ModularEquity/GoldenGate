import Link from "next/link";

type Props = {
  signInComplete: boolean;
  bankLinked: boolean;
  email: string;
  outstandingOnboarding: number;
};

export function OnboardingChecklist({
  signInComplete,
  bankLinked,
  email,
  outstandingOnboarding,
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
      label: "Bank account on file (Plaid or manual reference)",
      href: "/dashboard/fund",
    },
    {
      done: outstandingOnboarding === 0,
      label: "Onboarding steps (register, PPM, tax, wire/ACH)",
      href: "/dashboard/onboarding",
    },
  ];

  const completeCount = steps.filter((s) => s.done).length;

  return (
    <section className="rounded-xl border border-accent/30 bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-foreground">Your setup checklist</h2>
        <span className="text-xs text-muted">
          {completeCount}/{steps.length} complete
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
              {step.label.includes("Onboarding") && outstandingOnboarding > 0 ? (
                <span className="ml-2 rounded-md border border-red-500/50 bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-700 dark:text-red-300">
                  {outstandingOnboarding} left
                </span>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
      {!bankLinked ? (
        <p className="mt-4 text-sm text-muted">
          Next:{" "}
          <Link href="/dashboard/fund" className="text-accent hover:underline">
            Add a bank account
          </Link>{" "}
          (Plaid or manual last-4 reference).
        </p>
      ) : outstandingOnboarding > 0 ? (
        <p className="mt-4 text-sm text-muted">
          Next:{" "}
          <Link
            href="/dashboard/onboarding"
            className="text-accent hover:underline"
          >
            Finish onboarding ({outstandingOnboarding} step
            {outstandingOnboarding === 1 ? "" : "s"} outstanding)
          </Link>
        </p>
      ) : null}
    </section>
  );
}
