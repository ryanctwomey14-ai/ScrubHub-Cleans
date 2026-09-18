import { business } from "@/content/business";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/SectionIntro";

/** Closing conversion section: contact options + the full quote form. */
export function QuoteSection({
  title = (
    <>
      Let&rsquo;s make your home <em>feel right.</em>
    </>
  ),
  defaultService,
  defaultZip,
  headingLevel = "h2",
}: {
  title?: React.ReactNode;
  defaultService?: string;
  defaultZip?: string;
  headingLevel?: "h1" | "h2";
}) {
  const H = headingLevel;
  const channels = [
    { icon: "phone" as const, label: "Call", value: business.contact.phoneDisplay, href: business.contact.phoneHref },
    { icon: "message" as const, label: "Text", value: business.contact.phoneDisplay, href: business.contact.smsHref },
    { icon: "mail" as const, label: "Email", value: business.contact.email, href: business.contact.emailHref },
  ];

  return (
    <section id="quote" data-chat-avoid className="section scroll-mt-24 bg-linen" aria-labelledby="quote-title">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="min-w-0 lg:col-span-5">
          <div data-reveal>
            <Eyebrow>Get a quote</Eyebrow>
          </div>
          <H id="quote-title" data-reveal data-reveal-delay="0.08" className="display mt-6 text-[clamp(2.5rem,4.8vw,4.5rem)]">
            {title}
          </H>
          <p data-reveal data-reveal-delay="0.12" className="lede mt-6 max-w-md text-stone">
            Tell us a little about your space and we&rsquo;ll tailor a quote to it. Prefer to talk? We&rsquo;re
            available 24/7.
          </p>

          <ul className="mt-10 space-y-3">
            {channels.map((c, i) => (
              <li key={c.label} data-reveal data-reveal-delay={String(0.14 + i * 0.06)}>
                <a
                  href={c.href}
                  className="group flex items-center gap-4 rounded-2xl border border-sand bg-porcelain/60 p-4 transition-colors hover:border-ink/30 hover:bg-porcelain"
                >
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink text-porcelain">
                    <Icon name={c.icon} size={18} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-stone">{c.label}</span>
                    <span className="block truncate font-semibold">{c.value}</span>
                  </span>
                  <Icon name="arrow" size={16} className="text-stone transition-transform duration-500 group-hover:translate-x-1" />
                </a>
              </li>
            ))}
          </ul>
          <p data-reveal className="mt-6 flex items-center gap-2 text-[0.875rem] text-stone">
            <Icon name="clock" size={15} /> {business.hours.label} · {business.hours.detail}
          </p>
        </div>

        <div data-reveal data-reveal-delay="0.1" className="min-w-0 lg:col-span-7">
          <QuoteForm defaultService={defaultService} defaultZip={defaultZip} />
        </div>
      </div>
    </section>
  );
}
