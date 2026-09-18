import Link from "next/link";
import { business } from "@/content/business";
import { Icon, Stars } from "@/components/ui/Icon";

export function ReviewsBlock({ showLink = true }: { showLink?: boolean }) {
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
              <Stars className="text-hub" size={16} />
              <span className="mt-1 block text-[0.875rem] text-stone">{business.rating.count} reviews</span>
            </span>
          </div>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {business.testimonials.map((r, i) => (
            <li key={i} data-reveal data-reveal-delay={String(i * 0.06)}>
              <figure className="flex h-full flex-col rounded-2xl border border-sand bg-white p-7">
                <div className="flex items-center justify-between gap-3">
                  <Stars className="text-hub" size={15} />
                  {r.placeholder && (
                    <span className="rounded-md bg-linen px-2 py-1 text-[0.6875rem] font-bold uppercase tracking-wide text-stone">
                      Sample
                    </span>
                  )}
                </div>
                <blockquote className="mt-5 flex-1 text-[1.0625rem] leading-relaxed text-ink">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 text-[0.875rem]">
                  <span className="font-bold">{r.name}</span>
                  <span className="text-stone"> · {r.context}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {showLink && (
          <div data-reveal className="mt-8 text-center">
            <Link href="/reviews" className="link-draw inline-flex items-center gap-2 font-bold text-hub">
              See all reviews <Icon name="arrow" size={15} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
