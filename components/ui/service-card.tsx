"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

/**
 * Image card, adapted from 21st.dev "card-7" (TravelCard)
 * to the ScrubHub design system. Differences from the original:
 *  - brand tokens and fonts instead of shadcn theme variables
 *  - a labeled photo placeholder until a real image is supplied
 *  - no price on the card; a "Get My Price" button is always visible
 *  - hover (mouse devices only) lifts the card and zooms the photo
 */
export interface ServiceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl?: string;
  imageAlt: string;
  /** Shown on the placeholder until `imageUrl` is set: the exact photo to shoot. */
  photoBrief?: string;
  title: string;
  href?: string;
  subtitle: string;
  overview: string;
  bookLabel?: string;
  onBookNow: () => void;
  /** Short card: title + button only (used where the next step is the quote, not reading). */
  compact?: boolean;
}

const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(
  (
    {
      className,
      imageUrl,
      imageAlt,
      photoBrief,
      title,
      href,
      subtitle,
      overview,
      bookLabel = "Get My Price",
      onBookNow,
      compact = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative flex w-full overflow-hidden rounded-2xl bg-night text-white",
          compact ? "min-h-[19rem]" : "min-h-[22rem] md:min-h-[27rem]",
          "shadow-[0_24px_50px_-30px_rgba(8,18,38,0.6)] transition-all duration-300 ease-out",
          "can-hover:hover:-translate-y-2 can-hover:hover:shadow-[0_36px_70px_-30px_rgba(8,18,38,0.75)]",
          className,
        )}
        {...props}
      >
        {/* Background image (zooms on hover), or a labeled placeholder */}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes={compact ? "(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 250px" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-out can-hover:group-hover:scale-110"
          />
        ) : (
          <div
            role="img"
            aria-label={`Placeholder photo: ${photoBrief ?? imageAlt}`}
            className="absolute inset-0 bg-[linear-gradient(150deg,#1d3a6b_0%,#13264c_45%,#0b1733_100%)] transition-transform duration-700 ease-out can-hover:group-hover:scale-110"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-[0.08]"
              style={{ backgroundImage: "repeating-linear-gradient(115deg, #fff 0 1px, transparent 1px 14%)" }}
            />
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25 blur-3xl"
              style={{ background: "radial-gradient(circle, #3fd8f2, transparent 65%)" }}
            />
          </div>
        )}

        {/* Gradient overlay for text readability */}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent" />

        {/* Content */}
        <div className={cn("relative flex w-full flex-col justify-between", compact ? "p-5" : "p-6 md:p-7")}>
          {/* Top: photo label (until a real photo exists) */}
          <div className="flex items-start justify-end gap-3">
            {!imageUrl && photoBrief && !compact && (
              <span
                title={photoBrief}
                className="rounded-md bg-white/10 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-wide text-white/60 backdrop-blur-sm"
              >
                Photo placeholder
              </span>
            )}
          </div>

          {/* Details */}
          <div className={cn("space-y-4", compact ? "mt-auto pt-10" : "mt-auto pt-16 md:mt-24 md:pt-0")}>
            <div>
              <h3 className={cn("display leading-tight !font-bold", compact ? "text-[1.375rem]" : "text-[1.75rem]")}>
                {href ? (
                  <Link href={href} className="after:absolute after:inset-0 focus-visible:outline-none">
                    {title}
                  </Link>
                ) : (
                  title
                )}
              </h3>
              {subtitle && <p className="mt-1 text-[0.875rem] text-white/75">{subtitle}</p>}
            </div>
            {!compact && (
              <div>
                <h4 className="text-[0.6875rem] font-bold uppercase tracking-[0.14em] text-glint">Overview</h4>
                <p className="mt-1 text-[0.9375rem] leading-relaxed text-white/80">{overview}</p>
              </div>
            )}
          </div>

          {/* Button: always visible, so every card has one clear next step */}
          <div className={cn("relative z-10", compact ? "mt-4" : "mt-6")}>
            <button
              type="button"
              onClick={onBookNow}
              className={cn("btn w-full bg-white !text-ink hover:bg-white/90", compact && "!h-11 !px-4 !text-[0.875rem]")}
            >
              {bookLabel} <Icon name="arrow" size={16} className="btn-arrow" />
            </button>
          </div>
        </div>
      </div>
    );
  },
);
ServiceCard.displayName = "ServiceCard";

export { ServiceCard };
