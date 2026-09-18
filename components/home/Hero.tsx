"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { business, cityLabel } from "@/content/business";
import { Icon, Stars } from "@/components/ui/Icon";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { QuoteBar } from "./QuoteBar";

const HERO_PHOTO =
  "Sunlit living room, just finished: plumped cushions, clear surfaces, soft morning light through tall windows. Vertical, no people, no cleaning tools.";

export function Hero() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
      tl.to(".hero-line > span", { y: 0, duration: 1.5, stagger: 0.11 }, 0.15)
        .fromTo(
          "[data-hero-arch]",
          { clipPath: "inset(16% 14% 0% 14% round 999px 999px 32px 32px)" },
          { clipPath: "inset(0% 0% 0% 0% round 999px 999px 32px 32px)", duration: 1.9, ease: "expo.inOut" },
          0,
        )
        .fromTo("[data-hero-arch] > *", { scale: 1.14 }, { scale: 1, duration: 2.4 }, 0)
        .to("[data-hero-fade]", { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.7)
        .to("[data-hero-card]", { opacity: 1, y: 0, duration: 1.1 }, 1.3);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden pt-28 md:pt-36" aria-labelledby="hero-title">
      {/* a quiet linen plane behind the arch */}
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 hidden h-[88%] w-[38%] rounded-bl-[4rem] bg-linen lg:block"
      />

      <div className="shell relative">
        <div className="grid items-end gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 lg:pb-16">
            <p data-hero-fade className="eyebrow flex items-center gap-3 text-stone">
              <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
              Premium cleaning · {cityLabel}
            </p>

            <h1
              id="hero-title"
              className="display mt-7 text-[clamp(3.125rem,7.4vw,5.75rem)] leading-[0.96] tracking-[-0.03em]"
            >
              <span className="mask-line hero-line"><span>Tailored cleaning,</span></span>
              <span className="mask-line hero-line"><span>made <em>right.</em></span></span>
              <span className="mask-line hero-line"><span className="text-stone">Always.</span></span>
            </h1>

            <p data-hero-fade className="lede mt-8 max-w-[34rem] text-stone">
              We build every visit around your home and your routine, and if we ever miss a spot, we&rsquo;re back
              within {business.guarantee.hours} hours to make it right.
            </p>

            <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3">
              <Link href="/contact" className="btn btn-primary">
                Get a quote <Icon name="arrow" size={16} className="btn-arrow" />
              </Link>
              <a href={business.contact.phoneHref} className="btn btn-ghost">
                <Icon name="phone" size={16} /> {business.contact.phoneDisplay}
              </a>
            </div>

            <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-[0.9375rem]">
              <span className="flex items-center gap-2.5">
                <Stars className="text-hub" />
                <span>
                  <strong className="font-semibold">{business.rating.value}</strong>
                  <span className="text-stone"> from {business.rating.count} reviews</span>
                </span>
              </span>
              <span className="hidden h-4 w-px bg-sand sm:block" aria-hidden="true" />
              <span className="flex items-center gap-2 text-stone">
                <Icon name="clock" size={16} /> {business.hours.label}, call or text
              </span>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div
              data-hero-arch
              className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden md:max-w-[28rem] lg:max-w-[34rem] rounded-b-[2rem] rounded-t-[999px] lg:aspect-[3/4]"
            >
              <PhotoSlot
                brief={HERO_PHOTO}
                className="absolute inset-0 h-full w-full"
                briefClassName="bottom-4 md:bottom-5 lg:bottom-auto lg:top-[28%] lg:left-auto lg:w-[72%]"
              />
            </div>

            <div
              data-hero-card
              className="absolute -left-4 bottom-[24%] hidden max-w-[15rem] rounded-2xl border border-sand/70 bg-porcelain/95 p-5 shadow-[0_30px_60px_-35px_rgba(15,29,58,0.45)] backdrop-blur md:block lg:-left-14"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-glint">
                <Icon name="shield" size={19} />
              </span>
              <p className="display mt-4 text-[1.3125rem] leading-tight">The 24-hour promise</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-stone">
                Missed something? We&rsquo;re back within a day to fix it.
              </p>
            </div>
          </div>
        </div>

        <div data-hero-fade className="relative z-10 mt-10 lg:-mt-10 lg:max-w-[62rem]">
          <QuoteBar />
        </div>
      </div>
    </section>
  );
}
