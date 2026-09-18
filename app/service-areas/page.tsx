import type { Metadata } from "next";
import Link from "next/link";
import { business, cityLabel } from "@/content/business";
import { QuoteAgent } from "@/components/quote/QuoteAgent";
import { DarkHero } from "@/components/sections/DarkHero";
import { FinalCta } from "@/components/sections/FinalCta";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: `Service Area: ${cityLabel}`,
  description: `${business.name} provides home and commercial cleaning throughout ${cityLabel}. Not sure if we cover your address? Text us your zip code.`,
  alternates: { canonical: "/service-areas" },
};

export default function ServiceAreasPage() {
  return (
    <>
      <DarkHero
        eyebrow="Service area"
        title={
          <>
            Proudly Serving <em>{business.location.city}</em>
          </>
        }
        lede={`Homes, rentals, and workplaces across ${cityLabel}. Enter your zip on the form and we'll confirm coverage with your quote.`}
        photoBrief="Pittsburgh skyline or a recognizable local street at golden hour, with a ScrubHub vehicle in frame."
        crumbs={[{ href: "/service-areas", label: "Service Area" }]}
        form={<QuoteAgent />}
      />

      <section className="section" aria-labelledby="area-title">
        <div className="shell grid gap-4 md:grid-cols-2">
          <div data-reveal className="rounded-2xl border border-sand bg-white p-7 md:p-10">
            <p className="eyebrow">Where we clean</p>
            <h2 id="area-title" className="display h2 mt-4">Areas We Serve</h2>
            <ul className="mt-6 space-y-3">
              {business.serviceAreas.map((a) => (
                <li key={a} className="flex items-center gap-3 text-[1.125rem] font-semibold">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-linen text-hub">
                    <Icon name="pin" size={19} />
                  </span>
                  {a}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-stone">
              Services available: {business.services.map((s) => s.shortName).join(", ")}.
            </p>
          </div>
          <div data-reveal data-reveal-delay="0.08" className="on-ink flex flex-col rounded-2xl bg-ink p-7 text-white md:p-10">
            <h2 className="display text-[1.75rem] !font-bold">Not sure if you&rsquo;re covered?</h2>
            <p className="mt-3 flex-1 text-white/75">
              Text us your zip code and the service you need. We&rsquo;ll let you know right away. We&rsquo;re
              available 24/7.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={business.contact.smsHref} className="btn btn-primary">
                <Icon name="message" size={16} /> Text your zip
              </a>
              <Link href="#quote" className="btn btn-ghost-light">
                Get a quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
