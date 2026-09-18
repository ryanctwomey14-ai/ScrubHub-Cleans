import type { Metadata } from "next";
import { business } from "@/content/business";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Accordion } from "@/components/ui/Accordion";
import { OpenChatButton } from "@/components/chat/OpenChatButton";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: `Answers about quotes, services, our 24-hour make-it-right promise, and our service area, from ${business.name}.`,
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: business.faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }}
      />

      <PageHero
        eyebrow="FAQ"
        title={
          <>
            Questions, <em>answered.</em>
          </>
        }
        lede="The things clients ask us most. Don't see yours? Our concierge answers in seconds, or talk to the team any time."
      />

      <section className="pb-24 md:pb-32" aria-label="Frequently asked questions">
        <div className="shell grid gap-14 lg:grid-cols-12">
          <div data-reveal className="lg:col-span-8">
            <Accordion items={business.faqs} />
          </div>
          <aside data-reveal data-reveal-delay="0.1" className="lg:col-span-4">
            <div className="on-ink rounded-[1.75rem] bg-ink p-8 text-porcelain lg:sticky lg:top-28">
              <p className="display text-[1.75rem] leading-tight">Still wondering?</p>
              <p className="mt-3 text-porcelain/75">
                Ask our AI concierge, or reach the team directly. We&rsquo;re available 24/7.
              </p>
              <div className="mt-7 grid gap-3">
                <OpenChatButton className="btn btn-primary w-full">Ask the concierge</OpenChatButton>
                <a href={business.contact.phoneHref} className="btn btn-ghost-light w-full">
                  <Icon name="phone" size={16} /> {business.contact.phoneDisplay}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
