"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const steps = [
  {
    title: "Tell us about your space",
    body: `Call, text, or send the quote form. Tell us what matters most: the rooms, the routine, the details you notice.`,
  },
  {
    title: "We tailor the clean",
    body: "Your plan is built around your home and your schedule, not a generic checklist. Flexible from the first visit.",
  },
  {
    title: "Walk into it right",
    body: `Enjoy the result. And if anything was missed, we're back within ${business.guarantee.hours} hours to fix it.`,
  },
];

export function Process() {
  const lineRef = useRef<HTMLDivElement>(null);

  // The connecting hairline draws itself as the section scrolls into view.
  useEffect(() => {
    if (prefersReducedMotion() || !lineRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: lineRef.current, start: "top 85%", end: "top 35%", scrub: 0.6 },
        },
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="section" aria-labelledby="process-title">
      <div className="shell">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionIntro
            eyebrow="How it works"
            title={
              <span id="process-title">
                Three steps to a home <em>that feels right.</em>
              </span>
            }
            titleClassName="max-w-[16ch]"
          />
          <div data-reveal>
            <Link href="/contact" className="btn btn-ink">
              Start step one <Icon name="arrow" size={16} className="btn-arrow" />
            </Link>
          </div>
        </div>

        <div className="relative mt-16 md:mt-24">
          <div
            ref={lineRef}
            aria-hidden="true"
            className="absolute left-0 right-0 top-[1.625rem] hidden h-px origin-left bg-ink/25 md:block"
          />
          <ol className="grid gap-12 md:grid-cols-3 md:gap-10">
            {steps.map((step, i) => (
              <li key={step.title} data-reveal data-reveal-delay={String(0.1 * i)} className="relative">
                <span className="relative z-10 grid h-[3.25rem] w-[3.25rem] place-items-center rounded-full border border-ink/20 bg-porcelain font-sans text-[0.875rem] font-semibold tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display mt-8 text-[1.875rem] leading-tight md:text-[2.125rem]">{step.title}</h3>
                <p className="mt-4 max-w-[22rem] text-[1rem] leading-relaxed text-stone">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
