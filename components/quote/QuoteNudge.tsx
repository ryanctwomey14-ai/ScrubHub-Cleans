"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/Icon";
import { offer } from "@/content/pricing";
import { formatQuote } from "@/lib/quote";
import { actions, currentQuote, quoteStore } from "@/lib/quote-store";
import { scrollToQuote } from "@/lib/scroll-to-quote";
import { track } from "@/lib/track";

/**
 * Desktop exit intent: if someone has a price but hasn't booked and moves to
 * leave, remind them once per session that their price is held (loss aversion
 * + low effort). Never blocks the page; dismissible.
 */
export function QuoteNudge() {
  const s = useSyncExternalStore(quoteStore.subscribe, quoteStore.get, quoteStore.getServer);
  const [show, setShow] = useState(false);
  const router = useRouter();
  const eligible = Boolean(s.quotedAt && !s.booked);

  useEffect(() => {
    if (!eligible || !window.matchMedia("(pointer: fine)").matches) return;
    const onOut = (e: MouseEvent) => {
      if (e.clientY > 8 || e.relatedTarget) return;
      if (sessionStorage.getItem("scrubhub-nudged")) return;
      sessionStorage.setItem("scrubhub-nudged", "1");
      setShow(true);
      track("quote_nudge_shown");
    };
    document.addEventListener("mouseout", onOut);
    return () => document.removeEventListener("mouseout", onOut);
  }, [eligible]);

  const q = currentQuote(s.answers);
  if (!show || !eligible || !q) return null;

  const go = () => {
    track("quote_nudge_click");
    setShow(false);
    if (s.step === "quote") actions.startBooking();
    if (!scrollToQuote()) router.push("/contact#quote");
  };

  return (
    <div
      role="dialog"
      aria-label="Your price is saved"
      className="agent-in on-ink fixed bottom-6 left-6 z-50 hidden w-[22rem] rounded-2xl bg-ink p-5 text-white shadow-[0_30px_60px_-20px_rgba(8,18,38,0.7)] ring-1 ring-white/10 md:block"
    >
      <button
        type="button"
        onClick={() => setShow(false)}
        aria-label="Dismiss"
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-white/60 hover:bg-white/10 hover:text-white"
      >
        <Icon name="close" size={15} />
      </button>
      <p className="text-[0.8125rem] font-bold uppercase tracking-wide text-glint">Before you go</p>
      <p className="display mt-2 pr-6 text-[1.375rem] leading-tight">
        Your {formatQuote(q)} price is held for {offer.priceLockDays} days.
      </p>
      <p className="mt-2 text-[0.875rem] text-white/75">Pick your day now. It takes 10 seconds.</p>
      <button type="button" onClick={go} className="btn btn-primary mt-4 w-full">
        Pick my day <Icon name="arrow" size={16} className="btn-arrow" />
      </button>
    </div>
  );
}
