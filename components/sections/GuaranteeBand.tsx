import Link from "next/link";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";

/** The risk-reversal: the single strongest reason to book. */
export function GuaranteeBand() {
  return (
    <section className="py-[clamp(2.5rem,4vw,3.5rem)]" aria-labelledby="guarantee-title">
      <div className="shell">
        <div
          data-reveal
          className="on-ink grain relative overflow-hidden rounded-3xl bg-ink px-7 py-12 text-white md:px-14 md:py-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-25 blur-3xl"
            style={{ background: "radial-gradient(circle, #3fd8f2, transparent 65%)" }}
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto] lg:gap-12">
            <div className="grid h-24 w-24 place-items-center rounded-2xl bg-white/8 ring-1 ring-white/15">
              <span className="display text-[2.5rem] leading-none text-glint">
                {business.guarantee.hours}
                <span className="block text-center text-[0.75rem] font-bold uppercase tracking-[0.14em] text-mist">hours</span>
              </span>
            </div>
            <div>
              <p className="eyebrow">Our promise</p>
              <h2 id="guarantee-title" className="display mt-3 text-[clamp(1.75rem,3vw,2.5rem)]">
                We Will Make It Right. <em>Always.</em>
              </h2>
              <p className="mt-3 max-w-2xl text-white/75">{business.guarantee.body}</p>
            </div>
            <Link href="/contact" className="btn btn-primary">
              Book with confidence <Icon name="arrow" size={16} className="btn-arrow" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
