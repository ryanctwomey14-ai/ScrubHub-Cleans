import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { business, cityLabel, formatPrice, getService } from "@/content/business";
import { QuoteAgent } from "@/components/quote/QuoteAgent";
import { QuoteCta } from "@/components/quote/QuoteCta";
import { DarkHero } from "@/components/sections/DarkHero";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { ReviewsBlock } from "@/components/sections/ReviewsBlock";
import { FinalCta } from "@/components/sections/FinalCta";
import { Icon } from "@/components/ui/Icon";
import { serviceIcon } from "@/components/ui/serviceIcons";
import { JsonLd } from "@/lib/schema";

export function generateStaticParams() {
  return business.services.map((s) => ({ slug: s.slug }));
}

export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: service.seoTitle,
    description: service.seoDescription,
    alternates: { canonical: `/services/${service.slug}` },
    openGraph: { title: `${service.seoTitle} | ${business.name}`, description: service.seoDescription },
  };
}

export default async function ServicePage(props: PageProps<"/services/[slug]">) {
  const { slug } = await props.params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.intro,
          serviceType: service.name,
          areaServed: business.serviceAreas,
          provider: { "@id": `${business.siteUrl}/#business` },
          url: `${business.siteUrl}/services/${service.slug}`,
        }}
      />

      <DarkHero
        eyebrow={`${service.shortName} · ${cityLabel}`}
        title={
          <>
            {service.name} <em>in {business.location.city}</em>
          </>
        }
        lede={service.intro}
        photoBrief={service.photoBrief}
        crumbs={[
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.shortName },
        ]}
        form={<QuoteAgent defaultService={service.name} />}
      />

      <section className="section" aria-labelledby="included-title">
        <div className="shell grid gap-6 lg:grid-cols-12">
          <div data-reveal className="rounded-2xl border border-sand bg-white p-6 md:p-10 lg:col-span-7">
            <p className="eyebrow">What&rsquo;s included</p>
            <h2 id="included-title" className="display h2 mt-4">
              Where Your <em>Clean Focuses</em>
            </h2>
            <ul className="mt-6 grid gap-x-8 gap-y-3.5 sm:grid-cols-2 md:mt-8 md:gap-y-4">
              {service.focus.map((f) => (
                <li key={f} className="flex gap-3 text-[0.9375rem] leading-relaxed">
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-hub text-white">
                    <Icon name="check" size={13} strokeWidth={2.4} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <p className="mt-8 border-t border-sand pt-5 text-[0.875rem] text-stone">
              Every clean is tailored, so we confirm exactly what&rsquo;s included with your quote.
            </p>
          </div>

          <div data-reveal data-reveal-delay="0.08" className="on-ink flex flex-col rounded-2xl bg-ink p-6 text-white md:p-10 lg:col-span-5">
            <span className="grid h-14 w-14 place-items-center rounded-xl bg-white/10 text-glint">
              <Icon name={serviceIcon[service.slug]} size={26} />
            </span>
            <h3 className="display mt-6 text-[1.5rem] !font-bold">A great fit for</h3>
            <ul className="mt-5 flex-1 space-y-3 text-white/85">
              {service.idealFor.map((f) => (
                <li key={f} className="flex gap-3">
                  <span className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-glint" aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
              <span className="text-[0.875rem] font-bold text-mist">{formatPrice(service.startingPrice)}</span>
              <QuoteCta from="service_page" className="btn btn-primary !h-11" />
            </div>
          </div>
        </div>
      </section>

      <GuaranteeBand />
      <ReviewsBlock />
      <FinalCta
        defaultService={service.name}
        title={
          <>
            Book Your {service.shortName} <em>Today</em>
          </>
        }
      />
    </>
  );
}
