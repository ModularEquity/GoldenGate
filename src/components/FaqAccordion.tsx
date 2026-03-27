"use client";

import { useId, useState } from "react";

export type FaqItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
};

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isOpen = open === item.id;
        const panelId = `${baseId}-${item.id}-panel`;
        const headerId = `${baseId}-${item.id}-header`;
        return (
          <div
            key={item.id}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            <h3 id={headerId}>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm font-medium text-foreground hover:bg-background/50"
                onClick={() => setOpen(isOpen ? null : item.id)}
              >
                {item.question}
                <span className="text-muted" aria-hidden>
                  {isOpen ? "−" : "+"}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              hidden={!isOpen}
              className={isOpen ? "border-t border-border px-4 py-3 text-sm text-muted" : "hidden"}
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
