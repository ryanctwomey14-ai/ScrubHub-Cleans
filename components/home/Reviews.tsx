import Link from "next/link";
import { business } from "@/content/business";
import { Icon, Stars } from "@/components/ui/Icon";
import { ReviewCard } from "@/components/ui/ReviewCard";
import { Eyebrow } from "@/components/ui/SectionIntro";

export function Reviews() {
  return (
    <section className="section" aria-labelledby="reviews-title">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div data-reveal>
              <Eyebrow>Client reviews</Eyebrow>
            </div>
            <h2 id="reviews-title" data-reveal data-reveal-delay="0.08" className="display mt-6 text-[clamp(2.375rem,4.6vw,4.25rem)]">
              Trusted in homes <em>across {business.location.city}.</em>
            </h2>
          </div>
          <div data-reveal data-reveal-delay="0.12" className="flex items-center gap-6 lg:col-span-5 lg:justify-end">
            <p className="display text-[clamp(4.5rem,8vw,6.5rem)] leading-none tracking-[-0.04em]">
              {business.rating.value}
            </p>
            <div>
              <Stars className="text-hub" size={18} />
              <p className="mt-2 text-[0.9375rem] text-stone">
                Average from {business.rating.count} reviews
              </p>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-3">
          {business.testimonials.map((r, i) => (
            <ReviewCard key={i} review={r} delay={i * 0.08} />
          ))}
        </div>

        <div data-reveal className="mt-12 flex justify-center">
          <Link href="/reviews" className="btn btn-ghost">
            Read more reviews <Icon name="arrow" size={16} className="btn-arrow" />
          </Link>
        </div>
      </div>
    </section>
  );
}
