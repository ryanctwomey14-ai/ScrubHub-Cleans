import type { Metadata } from "next";
import { business, cityLabel } from "@/content/business";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { Stars } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Client Reviews",
  description: `${business.name} is rated ${business.rating.value} stars from ${business.rating.count} reviews. See what clients across ${cityLabel} say about their cleans.`,
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Client reviews"
        title={
          <>
            {business.rating.count} reviews. <em>One reputation.</em>
          </>
        }
        lede="We earn every review the same way: by listening, tailoring the clean, and making it right if anything's missed."
      >
        <div className="flex items-center gap-6">
          <p className="display text-[5rem] leading-none tracking-[-0.04em]">{business.rating.value}</p>
          <div>
            <Stars className="text-hub" size={18} />
            <p className="mt-2 text-stone">Average rating from {business.rating.count} reviews</p>
          </div>
        </div>
      </PageHero>

      <section className="pb-24 md:pb-32" aria-label="Reviews">
        <div className="shell grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {business.testimonials.map((r, i) => (
            <ReviewCard key={i} review={r} delay={(i % 3) * 0.08} />
          ))}
        </div>
      </section>

      <CtaBand
        title={
          <>
            Become our next <em>five-star review.</em>
          </>
        }
      />
    </>
  );
}
