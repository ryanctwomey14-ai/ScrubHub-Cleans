import { business } from "@/content/business";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Eyebrow } from "@/components/ui/SectionIntro";

export function Approach() {
  return (
    <section className="section bg-linen" aria-labelledby="approach-title">
      <div className="shell">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <div data-reveal>
              <Eyebrow>Our approach</Eyebrow>
            </div>
            <h2
              id="approach-title"
              data-reveal
              data-reveal-delay="0.08"
              className="display mt-6 text-[clamp(2.5rem,5.2vw,4.75rem)]"
            >
              There&rsquo;s no such thing as <em className="whitespace-nowrap">one-size-fits-all.</em>
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-14">
            <p data-reveal className="lede text-ink/80">
              Every home runs differently. Some clients want the kitchen spotless before anything else; others want the
              bedrooms reset while they&rsquo;re at work. So we start by listening, then shape every visit around what
              you tell us, and keep adjusting as your life changes.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-6 md:mt-24 lg:grid-cols-12 lg:gap-10">
          <div data-reveal className="lg:col-span-7">
            <PhotoSlot
              brief="Candid: a ScrubHub team member walking a client through a finished room, both smiling, natural light. Landscape. No cleaning tools in hand."
              className="aspect-[4/3] w-full rounded-[2rem] md:aspect-[16/11]"
            />
          </div>
          <ol className="flex flex-col justify-center lg:col-span-5">
            {business.differentiators.map((d, i) => (
              <li
                key={d.title}
                data-reveal
                data-reveal-delay={String(0.08 * i)}
                className="grid grid-cols-[3rem_1fr] gap-4 border-t border-sand py-8 first:border-t-0 first:pt-2 lg:first:pt-0"
              >
                <span className="display text-[1.5rem] leading-none text-hub">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="display text-[1.75rem] leading-tight">{d.title}</h3>
                  <p className="mt-3 text-[1rem] leading-relaxed text-stone">{d.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
