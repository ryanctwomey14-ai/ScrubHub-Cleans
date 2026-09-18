import type { Metadata } from "next";
import { business, cityLabel } from "@/content/business";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Eyebrow } from "@/components/ui/SectionIntro";

export const metadata: Metadata = {
  title: "About Us",
  description: `${business.name} is a premium cleaning company in ${cityLabel} built on one idea: put the client first, tailor every clean, and always make it right.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About ScrubHub"
        title={
          <>
            Built on <em>making it right.</em>
          </>
        }
        lede={`We started ${business.name} for people who've been let down by "good enough." We learn how you live, build the clean around it, and stand behind every visit.`}
      />

      <section className="pb-24 md:pb-32" aria-labelledby="story-title">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-5">
            <PhotoSlot
              brief="Portrait of the owner and team outside a client's front door or beside the company vehicle. Relaxed, confident, natural light, branded shirts."
              className="aspect-[4/5] w-full rounded-[2rem]"
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:pt-10">
            <div data-reveal>
              <Eyebrow>What we believe</Eyebrow>
            </div>
            <h2 id="story-title" data-reveal className="display mt-6 text-[clamp(2.25rem,4vw,3.5rem)]">
              Your home isn&rsquo;t a checklist. <em>It&rsquo;s yours.</em>
            </h2>
            <div data-reveal className="lede mt-8 space-y-6 text-ink/80">
              <p>
                Most cleaning companies run the same routine in every house. We don&rsquo;t think that&rsquo;s good
                enough. The way you use your kitchen, the rooms your kids take over, the details you notice the moment
                you walk in: that&rsquo;s what should shape a clean.
              </p>
              <p>
                So we listen first. We adapt to your space, your schedule, and what you&rsquo;re looking for, and we
                keep adapting as your life changes. There&rsquo;s a reason our clients stay with us for so long.
              </p>
              <p>
                And when something isn&rsquo;t right, we don&rsquo;t argue about it. We come back within{" "}
                {business.guarantee.hours} hours and fix it. We will make it right. Always.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-linen" aria-labelledby="values-title">
        <div className="shell">
          <div data-reveal>
            <Eyebrow>How we work</Eyebrow>
          </div>
          <h2 id="values-title" data-reveal className="display mt-6 max-w-[18ch] text-[clamp(2.375rem,4.6vw,4.25rem)]">
            Three commitments, <em>every visit.</em>
          </h2>
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            {business.differentiators.map((d, i) => (
              <div
                key={d.title}
                data-reveal
                data-reveal-delay={String(i * 0.08)}
                className="rounded-[1.75rem] bg-porcelain p-8 md:p-10"
              >
                <span className="display text-[3.5rem] leading-none text-hub">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display mt-10 text-[1.875rem] leading-tight">{d.title}</h3>
                <p className="mt-4 text-stone">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-label="By the numbers">
        <div className="shell">
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-center">
            {business.proofPoints.map((p, i) => (
              <li key={p} data-reveal data-reveal-delay={String(i * 0.08)} className="flex items-center gap-10">
                <span className="display text-[clamp(1.75rem,3.4vw,3rem)] italic">{p}</span>
                {i < business.proofPoints.length - 1 && (
                  <span className="hidden h-2 w-2 rounded-full bg-hub md:block" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-10 text-center text-stone">
            Rated {business.rating.value} stars across {business.rating.count} reviews · Serving {cityLabel}
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
