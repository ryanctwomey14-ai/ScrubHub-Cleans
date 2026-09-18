import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { ServiceTile } from "./ServiceTile";

/** Five services + a "not sure?" tile. Every tile leads to a quote. */
export function ServicesGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section className="section" aria-labelledby={heading ? "services-title" : undefined} aria-label={heading ? undefined : "Services"}>
      <div className="shell">
        {heading && (
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p data-reveal className="eyebrow">Our services</p>
              <h2 id="services-title" data-reveal className="display h2 mt-4 max-w-[20ch]">
                The Right Clean for <em>Every Space</em>
              </h2>
            </div>
            <p data-reveal className="max-w-sm text-stone">
              Pick your service and get your quote in 60 seconds. Every clean is tailored to your home.
            </p>
          </div>
        )}

        <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${heading ? "mt-12" : ""}`}>
          {business.services.map((s, i) => {
            const bestFor = s.idealFor[0];
            return (
              <li key={s.slug} data-reveal data-reveal-delay={String((i % 3) * 0.06)}>
                <ServiceTile
                  slug={s.slug}
                  name={s.name}
                  subtitle={`Best for ${bestFor.charAt(0).toLowerCase()}${bestFor.slice(1)}`}
                  overview={s.summary}
                  photoBrief={s.photoBrief}
                  image={s.image}
                />
              </li>
            );
          })}
          <li data-reveal data-reveal-delay="0.12">
            <div className="flex h-full min-h-[27rem] flex-col justify-end rounded-2xl border-2 border-dashed border-hub/30 bg-white p-7">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-linen text-hub">
                <Icon name="message" size={26} />
              </span>
              <h3 className="display mt-6 text-[1.375rem] !font-bold">Not sure what you need?</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">
                Tell us about your space and we&rsquo;ll recommend the right clean.
              </p>
              <div className="mt-6 grid gap-2.5">
                <a href={business.contact.smsHref} className="btn btn-primary w-full">
                  <Icon name="message" size={16} /> Text {business.contact.phoneDisplay}
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>
  );
}
