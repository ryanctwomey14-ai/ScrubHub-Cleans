import Link from "next/link";
import { business, formatPrice } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { serviceIcon } from "@/components/ui/serviceIcons";

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
              Pick your service. We&rsquo;ll tailor it to your home and send a quote that fits.
            </p>
          </div>
        )}

        <ul className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-3 ${heading ? "mt-12" : ""}`}>
          {business.services.map((s, i) => (
            <li key={s.slug} data-reveal data-reveal-delay={String((i % 3) * 0.06)}>
              <Link
                href={`/services/${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-sand bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-hub/40 hover:shadow-[0_24px_50px_-30px_rgba(26,95,232,0.5)]"
              >
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-linen text-hub transition-colors duration-300 group-hover:bg-hub group-hover:text-white">
                  <Icon name={serviceIcon[s.slug]} size={26} />
                </span>
                <h3 className="display mt-6 text-[1.375rem] !font-bold">{s.name}</h3>
                <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-stone">{s.summary}</p>
                <span className="mt-6 flex items-center justify-between border-t border-sand pt-5 text-[0.875rem] font-bold">
                  <span className="text-stone">{formatPrice(s.startingPrice)}</span>
                  <span className="flex items-center gap-1.5 text-hub">
                    Get a quote <Icon name="arrow" size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li data-reveal data-reveal-delay="0.12">
            <div className="on-ink flex h-full flex-col rounded-2xl bg-ink p-7 text-white">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-white/10 text-glint">
                <Icon name="message" size={26} />
              </span>
              <h3 className="display mt-6 text-[1.375rem] !font-bold">Not sure what you need?</h3>
              <p className="mt-2 flex-1 text-[0.9375rem] leading-relaxed text-white/75">
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
