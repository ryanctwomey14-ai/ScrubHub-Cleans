import type { Metadata } from "next";
import Link from "next/link";
import { business, cityLabel } from "@/content/business";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/SectionIntro";

export const metadata: Metadata = {
  title: `Service Area: ${cityLabel}`,
  description: `${business.name} provides home and commercial cleaning throughout ${cityLabel}. Not sure if we cover your address? Call or text your zip code.`,
  alternates: { canonical: "/service-areas" },
};

/** Abstract three-rivers mark: a quiet nod to Pittsburgh without a literal map. */
function RiversMark() {
  return (
    <svg viewBox="0 0 480 480" className="h-full w-full" role="img" aria-label="Abstract map of Pittsburgh's three rivers">
      <defs>
        <radialGradient id="glow" cx="50%" cy="52%" r="50%">
          <stop offset="0%" stopColor="#3fd8f2" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3fd8f2" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="240" cy="250" r="210" fill="url(#glow)" />
      {[70, 130, 190].map((r) => (
        <circle key={r} cx="240" cy="250" r={r} fill="none" stroke="rgba(247,245,240,0.10)" strokeDasharray="2 6" />
      ))}
      {/* Allegheny (from the northeast) */}
      <path d="M470 90 C 400 140, 330 170, 250 240" fill="none" stroke="rgba(247,245,240,0.55)" strokeWidth="10" strokeLinecap="round" />
      {/* Monongahela (from the southeast) */}
      <path d="M460 420 C 390 360, 320 300, 250 250" fill="none" stroke="rgba(247,245,240,0.55)" strokeWidth="10" strokeLinecap="round" />
      {/* Ohio (to the west) */}
      <path d="M250 245 C 180 220, 100 230, 10 190" fill="none" stroke="rgba(247,245,240,0.55)" strokeWidth="14" strokeLinecap="round" />
      <circle cx="248" cy="246" r="10" fill="#3fd8f2" />
      <circle cx="248" cy="246" r="22" fill="none" stroke="#3fd8f2" strokeOpacity="0.5" />
    </svg>
  );
}

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        eyebrow="Service area"
        title={
          <>
            Proudly serving <em>{business.location.city}.</em>
          </>
        }
        lede={`Homes, rentals, and workplaces across ${cityLabel}. If you're close by and not sure whether we cover your address, send us your zip code. We'll tell you straight away.`}
      />

      <section className="pb-24 md:pb-32" aria-labelledby="area-title">
        <div className="shell grid gap-5 lg:grid-cols-12">
          <div
            data-reveal
            className="on-ink relative aspect-square overflow-hidden rounded-[2rem] bg-ink p-8 lg:col-span-7 lg:aspect-auto lg:min-h-[34rem]"
          >
            <div className="absolute inset-0 p-6 md:p-10">
              <RiversMark />
            </div>
            <div className="absolute bottom-6 left-6 rounded-2xl bg-white/8 px-5 py-4 text-porcelain backdrop-blur md:bottom-8 md:left-8">
              <p className="eyebrow text-mist">Home base</p>
              <p className="display mt-2 text-[1.5rem]">{cityLabel}</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 lg:col-span-5">
            <div data-reveal className="rounded-[2rem] border border-sand bg-white/60 p-8 md:p-10">
              <Eyebrow>Where we clean</Eyebrow>
              <h2 id="area-title" className="display mt-6 text-[2.25rem] leading-tight">
                Areas we serve
              </h2>
              <ul className="mt-6 space-y-3">
                {business.serviceAreas.map((a) => (
                  <li key={a} className="flex items-center gap-3 text-[1.125rem]">
                    <Icon name="pin" size={18} className="text-hub" /> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal data-reveal-delay="0.08" className="flex-1 rounded-[2rem] bg-linen p-8 md:p-10">
              <h3 className="display text-[1.75rem] leading-tight">Not sure if you&rsquo;re covered?</h3>
              <p className="mt-3 text-stone">
                Text us your zip code and the service you need. We&rsquo;re available 24/7.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href={business.contact.smsHref} className="btn btn-ink">
                  <Icon name="message" size={16} /> Text your zip
                </a>
                <Link href="/contact" className="btn btn-ghost">
                  Get a quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-sand py-20 md:py-24" aria-labelledby="area-services-title">
        <div className="shell">
          <h2 id="area-services-title" data-reveal className="display text-[2rem] md:text-[2.5rem]">
            Services available in {business.location.city}
          </h2>
          <ul className="mt-8 flex flex-wrap gap-3">
            {business.services.map((s) => (
              <li key={s.slug} data-reveal>
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-sand px-5 font-medium transition-colors hover:border-ink hover:bg-ink hover:text-porcelain"
                >
                  {s.name}
                  <Icon name="arrow-up-right" size={15} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
