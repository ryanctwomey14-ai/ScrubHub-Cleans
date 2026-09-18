"use client";

import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { useNextOpening } from "@/lib/use-next-opening";

/**
 * Hero urgency block: the next open slot, with call/text as the backup.
 */
export function HeroOffer() {
  const opening = useNextOpening();

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
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
