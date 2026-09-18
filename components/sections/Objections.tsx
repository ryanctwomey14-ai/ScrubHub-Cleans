import { business } from "@/content/business";
import { offer } from "@/content/pricing";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { QuoteCta } from "@/components/quote/QuoteCta";

/**
 * Removes the last reasons not to book, right before the final call to action.
 * Only owner-confirmed answers are shown (see `business.objections`).
 */
export function Objections() {
  const items = business.objections.filter((o) => o.confirmed).map(({ question, answer }) => ({ question, answer }));

  return (
    <section className="section" aria-labelledby="objections-title">
      <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p data-reveal className="eyebrow">Before you book</p>
          <h2 id="objections-title" data-reveal className="display h2 mt-4 max-w-[14ch]">
            Questions? <em>Quick Answers.</em>
          </h2>
          <p data-reveal className="mt-4 max-w-sm text-stone">
            Everything people ask before they grab their spot, answered in one place.
          </p>

          <ul data-reveal className="mt-8 hidden space-y-3 text-[0.9375rem] lg:block">
            {[
              `${business.guarantee.hours}-hour make-it-right guarantee`,
              offer.payment,
              `Call or text ${business.contact.phoneDisplay}, 24/7`,
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-hub text-white">
                  <Icon name="check" size={13} strokeWidth={2.4} />
                </span>
                {t}
              </li>
            ))}
          </ul>

          <div data-reveal className="mt-8 hidden lg:block">
            <QuoteCta from="objections" />
          </div>
        </div>

        <div data-reveal className="rounded-2xl border border-sand bg-white px-6 md:px-8 lg:col-span-7">
          <Accordion items={items} />
        </div>

        <div className="-mt-4 lg:hidden">
          <QuoteCta from="objections" className="btn btn-primary w-full sm:w-auto" />
        </div>
      </div>
    </section>
  );
}
