import type { Metadata } from "next";
import { business } from "@/content/business";
import { DarkHero } from "@/components/sections/DarkHero";
import { FinalCta } from "@/components/sections/FinalCta";
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

      <DarkHero
        eyebrow="FAQ"
        title={
          <>
            Questions? <em>Answered.</em>
          </>
        }
        lede="Quick answers to what clients ask most. Still wondering? Call or text the team any time, 24/7."
        photoBrief="Close-up of a ScrubHub cleaner talking with a client at a kitchen island, both smiling."
        crumbs={[{ href: "/faq", label: "FAQ" }]}
      />

      <section className="section" aria-label="Frequently asked questions">
        <div className="shell grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div data-reveal className="rounded-2xl border border-sand bg-white px-6 md:px-10 lg:col-span-8">
            <Accordion items={business.faqs} />
          </div>
          <aside data-reveal data-reveal-delay="0.08" className="lg:col-span-4">
            <div className="on-ink rounded-2xl bg-ink p-8 text-white lg:sticky lg:top-28">
              <h2 className="display text-[1.5rem] !font-bold">Still have a question?</h2>
              <p className="mt-3 text-white/75">Call or text the team 24/7. A real person answers.</p>
              <div className="mt-6 grid gap-3">
                <OpenChatButton className="chat-only btn btn-primary w-full">Ask the concierge</OpenChatButton>
                <a href={business.contact.phoneHref} className="btn btn-ghost-light w-full">
                  <Icon name="phone" size={16} /> {business.contact.phoneDisplay}
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <FinalCta />
    </>
  );
}
