import { business } from "@/content/business";
import { QuoteAgent } from "@/components/quote/QuoteAgent";
import { Icon } from "@/components/ui/Icon";

/** Closing conversion block used at the bottom of every page. */
export function FinalCta({
  title = (
    <>
      Ready for a Home That&rsquo;s <em>Done Right?</em>
    </>
  ),
  defaultService,
}: {
  title?: React.ReactNode;
  defaultService?: string;
}) {
  return (
    <section data-chat-avoid className="section" aria-labelledby="final-cta-title">
      <div className="shell">
        <div className="on-ink grain relative overflow-hidden rounded-3xl bg-night px-6 py-10 text-white md:px-12 md:py-14 lg:px-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 -bottom-40 h-[30rem] w-[30rem] rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #1a5fe8, transparent 65%)" }}
          />
          <div className="relative grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <p data-reveal className="eyebrow">Get started</p>
              <h2 id="final-cta-title" data-reveal className="display mt-4 text-[clamp(2.25rem,4.2vw,3.5rem)]">
                {title}
              </h2>
              <p data-reveal className="lede mt-5 max-w-md text-white/75">
                Get your quote in under a minute, or reach us any time by call or text.
              </p>
              <ul data-reveal className="mt-8 space-y-3 text-[0.9375rem]">
                {[
                  `${business.rating.value}-star rated from ${business.rating.count} reviews`,
                  "Tailored to your home, never one-size-fits-all",
                  `${business.guarantee.hours}-hour make-it-right promise`,
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-hub">
                      <Icon name="check" size={13} strokeWidth={2.4} />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <a
                data-reveal
                href={business.contact.phoneHref}
                className="mt-8 inline-flex items-center gap-3 text-[1.125rem] font-bold hover:text-glint"
              >
                <Icon name="phone" size={20} /> {business.contact.phoneDisplay}
              </a>
            </div>
            <div data-reveal data-reveal-delay="0.08" className="lg:col-span-5 lg:col-start-8">
              <QuoteAgent defaultService={defaultService} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
