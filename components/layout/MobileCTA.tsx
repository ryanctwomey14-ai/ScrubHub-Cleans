"use client";

import { useRouter } from "next/navigation";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { scrollToQuote } from "@/lib/scroll-to-quote";
import { track } from "@/lib/track";

/** Always-visible booking bar on phones. "Get a quote" jumps to the assistant on the page. */
export function MobileCTA() {
  const router = useRouter();

  const openQuote = () => {
    track("quote_cta_click", { from: "mobile_bar" });
    if (!scrollToQuote()) router.push("/contact#quote");
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sand/80 bg-porcelain/92 px-3 pt-2.5 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-[1fr_1fr_1.35fr] gap-2">
        <a
          href={business.contact.phoneHref}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-sand bg-white text-sm font-bold text-ink"
        >
          <Icon name="phone" size={16} /> Call
        </a>
        <a
          href={business.contact.smsHref}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-sand bg-white text-sm font-bold text-ink"
        >
          <Icon name="message" size={16} /> Text
        </a>
        <button type="button" onClick={openQuote} className="btn btn-primary !h-12 !px-4 !text-sm">
          Instant price
        </button>
      </div>
    </div>
  );
}
