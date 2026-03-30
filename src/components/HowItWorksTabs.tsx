"use client";

import { useId, useState } from "react";

const TABS = [
  {
    id: "lock-up",
    label: "Lock-up duration",
    body: (
      <>
        <p>
          Each renovation opportunity has a <strong>planned hold period</strong>{" "}
          from acquisition through renovation, marketing, and sale. During that
          window, your capital is allocated to the deal and is{" "}
          <strong>not freely redeemable</strong> like a public stock—liquidity is
          limited until exit or as described in the fund/deal documents.
        </p>
        <p className="mt-3">
          Target timelines are shown on the deal materials (e.g. milestone dates).
          Actual duration can vary with construction, market conditions, and
          buyer activity. The definitive terms appear in the{" "}
          <strong>PPM, operating documents, and subscription agreement</strong>.
        </p>
      </>
    ),
  },
  {
    id: "expected-return",
    label: "Expected return",
    body: (
      <>
        <p>
          We present <strong>project-level economics</strong> for each
          opportunity—such as total cost, profit, and return metrics (including
          levered views where debt is used)—so you can compare opportunities on
          a consistent basis.
        </p>
        <p className="mt-3">
          These figures are <strong>forward-looking estimates</strong>, not
          guarantees. Realized returns depend on execution, costs, timing, and
          the exit market. Past performance of other deals does not predict
          future results.
        </p>
      </>
    ),
  },
  {
    id: "priced-estimates",
    label: "Priced estimates before the deal starts",
    body: (
      <>
        <p>
          Before you subscribe, we aim to publish <strong>priced underwriting</strong>
          —purchase price, renovation budget, transaction costs, financing
          assumptions, and a supported exit—so you are reviewing{" "}
          <strong>numbers tied to the specific property</strong>, not a vague
          “to be determined” later.
        </p>
        <p className="mt-3">
          If material assumptions change before closing, updates are communicated
          through the deal room and documentation process. Always rely on the{" "}
          <strong>final disclosure package</strong> for the version you are
          subscribing to.
        </p>
      </>
    ),
  },
] as const;

export function HowItWorksTabs() {
  const baseId = useId();
  const [open, setOpen] = useState(0);

  return (
    <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <h2 className="text-lg font-semibold text-foreground">
        How it works — key concepts
      </h2>
      <p className="mt-2 text-sm text-muted">
        A quick look at timing, returns, and transparency before you commit.
      </p>

      <div
        role="tablist"
        aria-label="How it works topics"
        className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4"
      >
        {TABS.map((tab, i) => {
          const selected = i === open;
          const tabId = `${baseId}-tab-${tab.id}`;
          const panelId = `${baseId}-panel-${tab.id}`;
          return (
            <button
              key={tab.id}
              id={tabId}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setOpen(i)}
              className={
                selected
                  ? "rounded-lg border-2 border-accent bg-accent/10 px-4 py-2 text-sm font-medium text-foreground"
                  : "rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-muted hover:border-accent/50 hover:text-foreground"
              }
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${baseId}-panel-${TABS[open].id}`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${TABS[open].id}`}
        className="mt-6 space-y-3 text-sm leading-relaxed text-muted [&_strong]:text-foreground"
      >
        {TABS[open].body}
      </div>
    </div>
  );
}
