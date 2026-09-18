import Link from "next/link";
import { business, formatPrice } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { SectionIntro } from "@/components/ui/SectionIntro";

export function ServicesIndex() {
  return (
    <section className="section" aria-labelledby="services-title">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionIntro
            className="lg:col-span-7"
            eyebrow="Services"
            title={
              <span id="services-title">
                Five services. <em>One standard.</em>
              </span>
            }
          />
          <p data-reveal data-reveal-delay="0.15" className="lede text-stone lg:col-span-5 lg:pb-3">
            From a standing weekly clean to a move-out on a deadline, every service is shaped around the space in
            front of us and held to the same promise.
          </p>
        </div>

        <ul className="mt-16 border-t border-sand md:mt-20">
          {business.services.map((s, i) => (
            <li key={s.slug} data-reveal data-reveal-delay={String(i * 0.05)} className="border-b border-sand">
              <Link
                href={`/services/${s.slug}`}
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 py-7 md:grid-cols-[4rem_1.1fr_1fr_auto] md:gap-x-8 md:py-9"
              >
                {/* hover wash */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-[-1.25rem] inset-y-0 -z-10 origin-bottom scale-y-0 rounded-2xl bg-linen transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-y-100 md:inset-x-[-2rem]"
                />
                <span className="self-start pt-2 font-sans text-[0.8125rem] font-semibold tabular-nums text-stone md:self-center md:pt-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="display text-[1.875rem] leading-tight transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 md:text-[2.5rem]">
                  {s.name}
                </span>
                <span className="col-start-2 text-[0.9375rem] leading-relaxed text-stone md:col-start-3 md:row-start-1">
                  {s.summary}
                  <span className="mt-2 block text-[0.8125rem] font-semibold text-ink/70">{formatPrice(s.startingPrice)}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="col-start-3 row-span-2 row-start-1 grid h-12 w-12 place-items-center self-center rounded-full border border-ink/15 transition-all duration-500 ease-[var(--ease-out-expo)] group-hover:border-ink group-hover:bg-ink group-hover:text-porcelain md:col-start-4 md:row-span-1"
                >
                  <Icon name="arrow-up-right" size={18} />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
