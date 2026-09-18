"use client";

import { useId, useState } from "react";
import type { Faq } from "@/content/business";

export function Accordion({ items, defaultOpen = 0 }: { items: Faq[]; defaultOpen?: number | null }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  const base = useId();

  return (
    <div className="border-t border-sand">
      {items.map((item, i) => {
        const isOpen = open === i;
        const btnId = `${base}-q${i}`;
        const panelId = `${base}-a${i}`;
        return (
          <div key={item.question} className="border-b border-sand">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className="display text-[1.375rem] leading-snug md:text-[1.625rem]">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ease-[var(--ease-out-expo)] ${
                    isOpen ? "rotate-45 border-ink bg-ink text-porcelain" : "border-ink/20 text-ink group-hover:border-ink"
                  }`}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M7 1v12M1 7h12" />
                  </svg>
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[var(--ease-out-expo)] ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <p className="max-w-2xl pb-7 pr-14 text-[1.0625rem] leading-relaxed text-stone">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
