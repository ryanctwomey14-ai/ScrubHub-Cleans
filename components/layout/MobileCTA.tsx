"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { scrollToQuote } from "@/lib/scroll-to-quote";
import { track } from "@/lib/track";

/**
 * Always-visible booking bar on phones. It slides away while a quote form is on
 * screen (the form is already the next step, and the bar would cover its buttons),
 * and comes back as soon as the visitor scrolls past it.
 */
export function MobileCTA() {
  const router = useRouter();
  const pathname = usePathname();
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    const forms = document.querySelectorAll("[data-quote-form]");
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setFormInView(visible.size > 0);
      },
      { threshold: 0.2 },
    );
    forms.forEach((f) => io.observe(f));
    return () => {
      io.disconnect();
      setFormInView(false);
    };
  }, [pathname]);

  const openQuote = () => {
    track("quote_cta_click", { from: "mobile_bar" });
    if (!scrollToQuote()) router.push("/contact#quote");
  };

  return (
    <div
      aria-hidden={formInView}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-sand/80 bg-porcelain/92 px-3 pt-2.5 backdrop-blur-xl transition-transform duration-300 ease-[var(--ease-out-expo)] md:hidden ${
        formInView ? "pointer-events-none translate-y-full" : "translate-y-0"
      }`}
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-[1fr_1fr_1.35fr] gap-2">
        <a
          href={business.contact.phoneHref}
          tabIndex={formInView ? -1 : undefined}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-sand bg-white text-sm font-bold text-ink"
        >
          <Icon name="phone" size={16} /> Call
        </a>
        <a
          href={business.contact.smsHref}
          tabIndex={formInView ? -1 : undefined}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border-[1.5px] border-sand bg-white text-sm font-bold text-ink"
        >
          <Icon name="message" size={16} /> Text
        </a>
        <button
          type="button"
          onClick={openQuote}
          tabIndex={formInView ? -1 : undefined}
          className="btn btn-primary !h-12 !px-4 !text-sm"
        >
          Get My Price
        </button>
      </div>
    </div>
  );
}
