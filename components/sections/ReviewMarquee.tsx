import { business, type Review } from "@/content/business";
import { Stars } from "@/components/ui/Icon";

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

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
/** `overlapHero`: the strip rides up onto the hero's dark bottom edge so proof shows at the fold. */
export function ReviewMarquee({ overlapHero = false }: { overlapHero?: boolean }) {
  const reviews = business.reviews;
  const Wrapper = business.reviewsUrl ? "a" : "div";

  return (
    <section aria-labelledby="google-reviews-title" className={overlapHero ? "on-ink relative z-10 -mt-28" : "pt-14 md:pt-16"}>
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

      <div className={`marquee group relative overflow-hidden ${overlapHero ? "mt-5" : "mt-8"}`}>
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
