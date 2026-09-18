import { business, type Review } from "@/content/business";
import { Stars } from "@/components/ui/Icon";
import { GoogleG } from "@/components/ui/GoogleG";

function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full w-[19rem] shrink-0 flex-col rounded-2xl border border-sand bg-white p-5 md:w-[22rem] md:p-6">
      <div className="flex items-center justify-between gap-3">
        <Stars className="text-[#FBBC04]" size={15} />
        <GoogleG size={18} />
      </div>
      <p className="mt-3 text-[0.9375rem] font-bold leading-snug text-ink">&ldquo;{review.title}&rdquo;</p>
      <blockquote className="mt-2 line-clamp-4 flex-1 text-[0.875rem] leading-relaxed text-stone">{review.text}</blockquote>
      <figcaption className="mt-4 flex items-center gap-3 text-[0.8125rem]">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-linen font-bold text-hub" aria-hidden="true">
          {review.name.charAt(0)}
        </span>
        <span>
          <span className="block font-bold">{review.name}</span>
          <span className="text-stone">{business.reviewsSource} review</span>
        </span>
      </figcaption>
    </figure>
  );
}

/**
 * Infinite, CSS-only review loop. The list is rendered twice and the track
 * slides by exactly half its width, so the seam is invisible. Pauses on hover
 * and keyboard focus; with reduced motion it becomes a swipeable row instead.
 */
/**
 * `overlapHero`: the strip rides up onto the hero's dark bottom edge so proof shows at the fold.
 * `showHeader`: hide the rating header when the hero already shows it (see ReviewsBanner).
 */
export function ReviewMarquee({ overlapHero = false, showHeader = true }: { overlapHero?: boolean; showHeader?: boolean }) {
  const reviews = business.reviews;
  const Wrapper = business.reviewsUrl ? "a" : "div";

  return (
    <section
      aria-label={`${business.reviewsSource} reviews`}
      className={overlapHero ? `on-ink relative z-10 ${showHeader ? "-mt-28" : "-mt-24"}` : "pt-14 md:pt-16"}
    >
      {showHeader && (
      <div className="shell flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Wrapper
          {...(business.reviewsUrl
            ? { href: business.reviewsUrl, target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className="flex items-center gap-3"
        >
          <GoogleG size={28} />
          <span>
            <span id="google-reviews-title" className={`block text-[0.9375rem] font-bold ${overlapHero ? "text-white" : ""}`}>
              {business.reviewsSource} Reviews
            </span>
            <span className={`flex items-center gap-2 text-[0.875rem] ${overlapHero ? "text-white/70" : "text-stone"}`}>
              <strong className={overlapHero ? "text-white" : "text-ink"}>{business.rating.value}</strong>
              <Stars className="text-[#FBBC04]" size={13} />
              {business.rating.count} reviews
            </span>
          </span>
        </Wrapper>
        <p className={`text-[0.875rem] ${overlapHero ? "text-white/70" : "text-stone"}`}>
          What clients across {business.location.city} are saying.
        </p>
      </div>
      )}

      <div className={`marquee group relative overflow-hidden ${!showHeader ? "" : overlapHero ? "mt-5" : "mt-8"}`}>
        <ul className="marquee-track flex w-max gap-4">
          {reviews.map((r, i) => (
            <li key={`a-${i}`}>
              <ReviewCard review={r} />
            </li>
          ))}
          {reviews.map((r, i) => (
            <li key={`b-${i}`} aria-hidden="true" className="marquee-dupe">
              <ReviewCard review={r} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
