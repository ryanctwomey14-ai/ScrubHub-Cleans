import type { Metadata } from "next";
import Link from "next/link";
import { business, cityLabel, formatPrice } from "@/content/business";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Process } from "@/components/home/Process";
import { Icon } from "@/components/ui/Icon";
import { PhotoSlot } from "@/components/ui/PhotoSlot";

export const metadata: Metadata = {
  title: `Cleaning Services in ${cityLabel}`,
  description: `Maintenance, deep, move-in/move-out, Airbnb turnover, and commercial cleaning in ${cityLabel}, each tailored to your space and backed by a 24-hour make-it-right promise.`,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Every space, <em>its own plan.</em>
          </>
        }
        lede="Five services, one standard. Choose where to start. We'll shape the details around your home, your schedule, and what matters most to you."
      />

      <section className="pb-24 md:pb-32" aria-label="All services">
        <div className="shell grid gap-5 md:grid-cols-2 lg:gap-6">
          {business.services.map((s, i) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              data-reveal
              data-reveal-delay={String((i % 2) * 0.08)}
              className={`group flex flex-col overflow-hidden rounded-[2rem] border border-sand bg-white/50 transition-colors duration-500 hover:bg-white ${
                i === 0 ? "md:col-span-2 md:flex-row" : ""
              }`}
            >
              <div className={`relative overflow-hidden ${i === 0 ? "md:w-1/2" : ""}`}>
                <PhotoSlot
                  brief={s.photoBrief}
                  className={`w-full transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.03] ${
                    i === 0 ? "aspect-[4/3] md:aspect-auto md:h-full md:min-h-[26rem]" : "aspect-[16/10]"
                  }`}
                />
              </div>
              <div className={`flex flex-1 flex-col p-7 md:p-10 ${i === 0 ? "md:justify-center" : ""}`}>
                <p className="eyebrow text-stone">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="display mt-4 text-[2rem] leading-tight md:text-[2.5rem]">{s.name}</h2>
                <p className="mt-4 max-w-md text-stone">{s.summary}</p>
                <div className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <span className="text-[0.875rem] font-semibold text-ink/70">{formatPrice(s.startingPrice)}</span>
                  <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold">
                    Explore
                    <span className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:border-ink group-hover:bg-ink group-hover:text-porcelain">
                      <Icon name="arrow-up-right" size={16} />
                    </span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className="bg-linen">
        <Process />
      </div>
      <div className="pt-24 md:pt-32">
        <CtaBand />
      </div>
    </>
  );
}
