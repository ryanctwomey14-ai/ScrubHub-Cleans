import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { ServiceTile } from "./ServiceTile";

/**
 * Five services + a "not sure?" tile. Every tile leads to a quote.
 * `compact` (homepage): one short row, no links off the page, swipeable on phones.
 */
export function ServicesGrid({ heading = true, compact = false }: { heading?: boolean; compact?: boolean }) {
  return (
    <section className={compact ? "pb-[clamp(3.5rem,6vw,5.5rem)] pt-[clamp(3rem,5vw,4.5rem)]" : "section"} aria-labelledby={heading ? "services-title" : undefined} aria-label={heading ? undefined : "Services"}>
      <div className="shell">
        {heading && (
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p data-reveal className="eyebrow">Our services</p>
              <h2 id="services-title" data-reveal className="display h2 mt-4 max-w-[20ch]">
                {compact ? (
                  <>
                    Pick Your Clean. <em>See Your Price.</em>
                  </>
                ) : (
                  <>
                    The Right Clean for <em>Every Space</em>
                  </>
                )}
              </h2>
            </div>
            <p data-reveal className="max-w-sm text-stone">
              {compact
                ? "Tap a service and your exact price is about 60 seconds away. Every clean is tailored to your home."
                : "Pick your service and get your quote in 60 seconds. Every clean is tailored to your home."}
            </p>
          </div>
        )}

        <ul
          className={
            compact
              ? "-mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 md:grid-cols-3 lg:grid-cols-5 lg:gap-4"
              : `grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${heading ? "mt-12" : ""}`
          }
        >
          {business.services.map((s, i) => {
            const bestFor = s.idealFor[0];
            return (
              <li
                key={s.slug}
                data-reveal
                data-reveal-delay={String((i % (compact ? 5 : 3)) * 0.06)}
                className={compact ? "w-[15.5rem] shrink-0 snap-start sm:w-auto" : undefined}
              >
                <ServiceTile
                  slug={s.slug}
                  name={compact ? s.shortName : s.name}
                  compact={compact}
                  subtitle={compact ? "" : `Best for ${bestFor.charAt(0).toLowerCase()}${bestFor.slice(1)}`}
                  overview={s.summary}
                  photoBrief={s.photoBrief}
                  image={s.image}
                />
              </li>
            );
          })}
          {!compact && (
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
          )}
        </ul>
      </div>
    </section>
  );
}
