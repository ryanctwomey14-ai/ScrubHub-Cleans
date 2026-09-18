import type { Testimonial } from "@/content/business";
import { Stars } from "./Icon";

export function ReviewCard({ review, delay = 0 }: { review: Testimonial; delay?: number }) {
  return (
    <figure
      data-reveal
      data-reveal-delay={String(delay)}
      className="flex h-full flex-col rounded-[1.75rem] border border-sand bg-white/60 p-7 md:p-9"
    >
      <div className="flex items-center justify-between gap-4">
        <Stars className="text-hub" size={15} />
        {review.placeholder && (
          <span className="rounded-full bg-linen px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide text-stone">
            Sample review
          </span>
        )}
      </div>
      <blockquote className="display mt-7 flex-1 text-[1.3125rem] leading-[1.4] md:text-[1.4375rem]">
        “{review.quote}”
      </blockquote>
      <figcaption className="mt-8 border-t border-sand pt-5 text-[0.875rem]">
        <span className="font-semibold text-ink">{review.name}</span>
        <span className="text-stone"> · {review.context}</span>
      </figcaption>
    </figure>
  );
}
