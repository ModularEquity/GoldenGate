import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function OnboardingStepCard({
  complete,
  title,
  description,
  children,
  className,
  id,
}: {
  complete: boolean;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={cn(
        "flex flex-col rounded-xl bg-card p-5 shadow-sm transition-colors",
        complete
          ? "border border-border"
          : "border-2 border-red-500/80 ring-1 ring-red-500/20",
        className,
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="font-semibold text-foreground">{title}</h2>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
            complete
              ? "bg-green-500/15 text-green-700 dark:text-green-400"
              : "bg-red-500/15 text-red-700 dark:text-red-300",
          )}
        >
          {complete ? "Done" : "Outstanding"}
        </span>
      </div>
      {description ? (
        <div className="mt-2 text-sm text-muted">{description}</div>
      ) : null}
      {children ? <div className="mt-4 flex-1">{children}</div> : null}
    </div>
  );
}
