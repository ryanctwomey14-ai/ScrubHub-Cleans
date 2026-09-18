"use client";

import { useSyncExternalStore } from "react";
import { business } from "@/content/business";
import { offer } from "@/content/pricing";
import { Icon } from "@/components/ui/Icon";
import { nextAvailable } from "@/lib/quote-store";

const noop = () => () => {};

/** Next open slot, computed in the browser so a cached page never shows a stale date. */
function useNextOpening() {
  return useSyncExternalStore(
    noop,
    () => {
      const n = nextAvailable();
      return `${n.label} · ${n.window}`;
    },
    () => "",
  );
}

/**
 * Hero "offer" block (Hormozi: stack value, reverse risk, give a reason to act
 * now): three offer points, the next open slot, and call/text as the backup.
 */
export function HeroOffer() {
  const opening = useNextOpening();
  const points = [
    `${business.guarantee.hours}-hour make-it-right guarantee`,
    offer.bonusShort,
    "$0 today. Pay after you're happy.",
  ].filter(Boolean) as string[];

  return (
    <div className="w-full">
      <ul className="flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:gap-x-5">
        {points.map((p) => (
          <li key={p} className="flex items-center gap-2 text-[0.9375rem] font-semibold text-white">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-glint text-night">
              <Icon name="check" size={12} strokeWidth={2.8} />
            </span>
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
        <span className="flex items-center gap-3">
          <span className="relative grid h-12 w-12 place-items-center rounded-full bg-white/10 text-glint ring-1 ring-white/20">
            <Icon name="clock" size={20} />
            <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-[#22c55e]" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-mist">Next opening</span>
            <span className="display block min-h-[1.5rem] text-[1.125rem] !font-bold">{opening}</span>
          </span>
        </span>
        <span className="hidden h-10 w-px bg-white/15 sm:block" aria-hidden="true" />
        <a href={business.contact.phoneHref} className="group flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition-colors group-hover:bg-hub">
            <Icon name="phone" size={19} />
          </span>
          <span className="leading-tight">
            <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-mist">Call or text · 24/7</span>
            <span className="display block text-[1.125rem] !font-bold">{business.contact.phoneDisplay}</span>
          </span>
        </a>
      </div>
    </div>
  );
}
