import Link from "next/link";
import { business, type Review } from "@/content/business";
import { Icon, Stars } from "@/components/ui/Icon";

export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-sand bg-white p-6 md:p-7">
      <Stars className="text-[#FBBC04]" size={15} />
      <p className="display mt-4 text-[1.1875rem] leading-snug !font-bold">&ldquo;{review.title}&rdquo;</p>
      <blockquote className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-stone">{review.text}</blockquote>
      <figcaption className="mt-6 flex items-center gap-3 border-t border-sand pt-5 text-[0.875rem]">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-linen font-bold text-hub" aria-hidden="true">
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

export function ReviewsBlock({ showLink = true, all = false }: { showLink?: boolean; all?: boolean }) {
  const reviews = all ? business.reviews : business.reviews.filter((r) => r.featured);

  return (
    <section className="section" aria-labelledby="reviews-title">
      <div className="shell">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p data-reveal className="eyebrow">Reviews</p>
            <h2 id="reviews-title" data-reveal className="display h2 mt-4 max-w-[18ch]">
              Loved by Clients Across <em>{business.location.city}</em>
            </h2>
          </div>
          <div data-reveal className="flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-[0_20px_40px_-30px_rgba(8,18,38,0.4)]">
            <span className="display text-[2.75rem] leading-none">{business.rating.value}</span>
            <span>
              <Stars className="text-[#FBBC04]" size={16} />
              <span className="mt-1 block text-[0.875rem] text-stone">{business.rating.count} reviews</span>
            </span>
          </div>
        </div>

        <ul
          className={`mt-8 gap-4 md:mt-12 md:grid md:grid-cols-2 lg:grid-cols-3 ${
            all ? "grid" : "-mx-5 flex snap-x snap-mandatory overflow-x-auto px-5 pb-2 [scrollbar-width:none]"
          }`}
        >
          {reviews.map((r, i) => (
            <li
              key={r.name}
              data-reveal
              data-reveal-delay={String((i % 3) * 0.06)}
              className={all ? "" : "w-[85%] shrink-0 snap-start md:w-auto"}
            >
              <ReviewCard review={r} />
            </li>
          ))}
        </ul>

        {showLink && (
          <div data-reveal className="mt-8 text-center">
            <Link href="/reviews" className="link-draw inline-flex items-center gap-2 py-2 font-bold text-hub">
              Read all {business.reviews.length} client stories <Icon name="arrow" size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
