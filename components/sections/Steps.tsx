import Link from "next/link";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";

const steps = [
  { title: "Get your quote", body: "Call, text, or send the form. It takes under a minute." },
  { title: "We tailor the clean", body: "Your plan is built around your home, priorities, and schedule." },
  {
    title: "Enjoy a spotless home",
    body: `And if anything's missed, we're back within ${business.guarantee.hours} hours to make it right.`,
  },
];

export function Steps() {
  return (
    <section className="section bg-linen" aria-labelledby="steps-title">
      <div className="shell">
        <div className="text-center">
          <p data-reveal className="eyebrow">How it works</p>
          <h2 id="steps-title" data-reveal className="display h2 mx-auto mt-4 max-w-[18ch]">
            Booked in <em>3 Easy Steps</em>
          </h2>
        </div>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} data-reveal data-reveal-delay={String(i * 0.08)} className="relative rounded-2xl bg-white p-7 md:p-8">
              <span className="display text-[3rem] leading-none text-hub/15">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-3 text-[1.375rem] !font-bold">{s.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{s.body}</p>
            </li>
          ))}
        </ol>

        <div data-reveal className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn btn-primary">
            Start with a quote <Icon name="arrow" size={16} className="btn-arrow" />
          </Link>
          <a href={business.contact.phoneHref} className="btn btn-ghost">
            <Icon name="phone" size={16} /> {business.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
