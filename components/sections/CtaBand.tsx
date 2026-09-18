import Link from "next/link";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";

/** Compact closing call-to-action for inner pages. */
export function CtaBand({
  title = (
    <>
      Ready when <em>you are.</em>
    </>
  ),
  body = `Call, text, or request a quote, any hour of the day. Every clean is backed by our ${business.guarantee.hours}-hour make-it-right promise.`,
}: {
  title?: React.ReactNode;
  body?: string;
}) {
  return (
    <section className="pb-24 md:pb-32" aria-label="Get in touch">
      <div className="shell">
        <div
          data-reveal
          className="on-ink relative overflow-hidden rounded-[2rem] bg-ink px-7 py-14 text-porcelain md:rounded-[2.5rem] md:px-16 md:py-20"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #3fd8f2, transparent 65%)" }}
          />
          <div className="relative grid gap-10 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <h2 className="display text-[clamp(2.5rem,5vw,4.5rem)]">{title}</h2>
              <p className="lede mt-5 max-w-xl text-porcelain/75">{body}</p>
            </div>
            <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
              <Link href="/contact" className="btn btn-primary">
                Get a quote <Icon name="arrow" size={16} className="btn-arrow" />
              </Link>
              <a href={business.contact.phoneHref} className="btn btn-ghost-light">
                <Icon name="phone" size={16} /> {business.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
