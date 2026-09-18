import { business } from "@/content/business";
import { Stars } from "@/components/ui/Icon";
import { GoogleG } from "@/components/ui/GoogleG";

/** Horizontal Google rating banner that sits above the hero headline. */
export function ReviewsBanner() {
  const Wrapper = business.reviewsUrl ? "a" : "div";
  return (
    <Wrapper
      {...(business.reviewsUrl ? { href: business.reviewsUrl, target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={`${business.reviewsSource} reviews: ${business.rating.value} out of 5 from ${business.rating.count} reviews`}
      className="inline-flex max-w-full items-center gap-3 whitespace-nowrap rounded-full bg-white/[0.08] py-2 pl-2.5 pr-4 ring-1 ring-white/15 backdrop-blur-md sm:pr-5"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white">
        <GoogleG size={18} />
      </span>
      <span className="hidden text-[0.9375rem] font-bold text-white sm:inline">{business.reviewsSource} Reviews</span>
      <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden="true" />
      <span className="flex items-center gap-2 text-[0.875rem] sm:text-[0.9375rem]">
        <strong className="text-white">{business.rating.value}</strong>
        <Stars className="text-[#FBBC04]" size={14} />
        <span className="text-white/70">{business.rating.count} reviews</span>
      </span>
    </Wrapper>
  );
}
