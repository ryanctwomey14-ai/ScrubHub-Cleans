import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { business, cityLabel, formatPrice, getService } from "@/content/business";
import { PageHero } from "@/components/sections/PageHero";
import { QuoteSection } from "@/components/sections/QuoteSection";
import { Icon } from "@/components/ui/Icon";
import { PhotoSlot } from "@/components/ui/PhotoSlot";
import { Eyebrow } from "@/components/ui/SectionIntro";
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

  const others = business.services.filter((s) => s.slug !== service.slug);

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

      <PageHero
        eyebrow={`${service.shortName} · ${cityLabel}`}
        title={service.name}
        lede={service.intro}
        crumbs={[
          { href: "/services", label: "Services" },
          { href: `/services/${service.slug}`, label: service.shortName },
        ]}
      >
        <div className="flex flex-wrap items-center gap-3">
          <Link href={`/contact?service=${encodeURIComponent(service.name)}#quote`} className="btn btn-primary">
            Get a {service.shortName.toLowerCase()} quote <Icon name="arrow" size={16} className="btn-arrow" />
          </Link>
          <a href={business.contact.smsHref} className="btn btn-ghost">
            <Icon name="message" size={16} /> Text {business.contact.phoneDisplay}
          </a>
          <span className="ml-1 text-[0.9375rem] text-stone">{formatPrice(service.startingPrice)}</span>
        </div>
      </PageHero>

      <section className="pb-24 md:pb-32" aria-labelledby="focus-title">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div data-reveal className="lg:col-span-6">
            <PhotoSlot brief={service.photoBrief} className="aspect-[4/5] w-full rounded-[2rem] lg:sticky lg:top-28" />
          </div>

          <div className="lg:col-span-6 lg:pt-6">
            <div data-reveal>
              <Eyebrow>What we focus on</Eyebrow>
            </div>
            <h2 id="focus-title" data-reveal className="display mt-6 text-[clamp(2.25rem,3.8vw,3.25rem)]">
              Where a typical visit <em>spends its time.</em>
            </h2>
            <ul className="mt-10 border-t border-sand">
              {service.focus.map((f, i) => (
                <li
                  key={f}
                  data-reveal
                  data-reveal-delay={String(i * 0.04)}
                  className="flex gap-4 border-b border-sand py-5 text-[1.0625rem]"
                >
                  <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink text-porcelain">
                    <Icon name="check" size={13} strokeWidth={2.2} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <p data-reveal className="mt-6 text-[0.9375rem] text-stone">
              Every clean is tailored, so we&rsquo;ll confirm exactly what&rsquo;s included with your quote.
            </p>

            <div data-reveal className="mt-14 rounded-[1.75rem] bg-linen p-8 md:p-10">
              <h3 className="display text-[1.75rem]">A good fit for</h3>
              <ul className="mt-6 space-y-3">
                {service.idealFor.map((f) => (
                  <li key={f} className="flex gap-3 text-ink/85">
                    <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-hub" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div data-reveal className="on-ink mt-5 flex gap-5 rounded-[1.75rem] bg-ink p-8 text-porcelain md:p-10">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/8 text-glint">
                <Icon name="shield" size={22} />
              </span>
              <div>
                <h3 className="display text-[1.75rem] leading-tight">{business.guarantee.headline}</h3>
                <p className="mt-3 text-porcelain/75">{business.guarantee.body}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-sand py-20 md:py-24" aria-labelledby="more-title">
        <div className="shell">
          <h2 id="more-title" data-reveal className="display text-[2rem] md:text-[2.5rem]">
            Other services
          </h2>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s, i) => (
              <li key={s.slug} data-reveal data-reveal-delay={String(i * 0.05)}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-sand p-6 transition-colors hover:border-ink/30 hover:bg-white/60"
                >
                  <span className="display text-[1.375rem] leading-tight">{s.name}</span>
                  <span className="flex items-center justify-between text-[0.875rem] text-stone">
                    {formatPrice(s.startingPrice)}
                    <Icon name="arrow-up-right" size={16} className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <QuoteSection
        defaultService={service.name}
        title={
          <>
            Get your {service.shortName.toLowerCase()} <em>quote.</em>
          </>
        }
      />
    </>
  );
}
