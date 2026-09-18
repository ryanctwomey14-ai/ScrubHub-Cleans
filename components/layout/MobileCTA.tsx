import Link from "next/link";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";

/** Always-visible booking bar on phones. The chat launcher sits above it. */
export function MobileCTA() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-sand/80 bg-porcelain/92 px-3 pt-2.5 backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "calc(0.625rem + env(safe-area-inset-bottom))" }}
    >
      <div className="grid grid-cols-[1fr_1fr_1.35fr] gap-2">
        <a
          href={business.contact.phoneHref}
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-ink/15 text-sm font-semibold text-ink"
        >
          <Icon name="phone" size={16} /> Call
        </a>
        <a
          href={business.contact.smsHref}
          className="flex h-12 items-center justify-center gap-2 rounded-full border border-ink/15 text-sm font-semibold text-ink"
        >
          <Icon name="message" size={16} /> Text
        </a>
        <Link href="/contact" className="btn btn-primary !h-12 !px-4 !text-sm">
          Get a quote
        </Link>
      </div>
    </div>
  );
}
