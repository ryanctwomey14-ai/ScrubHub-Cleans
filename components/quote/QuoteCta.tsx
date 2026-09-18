"use client";

import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { scrollToQuote } from "@/lib/scroll-to-quote";
import { track } from "@/lib/track";

/** The site's one call to action. Label is the same everywhere on purpose. */
export const CTA_LABEL = "Get My Price";

/**
 * Every "get a quote" button on the site. Scrolls to the quote assistant on
 * the current page (no page change = no drop-off); falls back to /contact.
 */
export function QuoteCta({
  className = "btn btn-primary",
  from,
  onClick,
  children,
}: {
  className?: string;
  /** Where the click came from, for funnel tracking. */
  from: string;
  /** Runs before scrolling (e.g. close the mobile menu). */
  onClick?: () => void;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        track("quote_cta_click", { from });
        const go = () => {
          if (!scrollToQuote()) router.push("/contact#quote");
        };
        if (onClick) {
          onClick();
          setTimeout(go, 80); // let an overlay (mobile menu) unlock scrolling first
        } else go();
      }}
    >
      {children ?? (
        <>
          {CTA_LABEL} <Icon name="arrow" size={16} className="btn-arrow" />
        </>
      )}
    </button>
  );
}
