import Link from "next/link";
import { business } from "@/content/business";
import { Accordion } from "@/components/ui/Accordion";
import { Icon } from "@/components/ui/Icon";
import { Eyebrow } from "@/components/ui/SectionIntro";
import { OpenChatButton } from "@/components/chat/OpenChatButton";

export function FaqPreview() {
  return (
    <section className="section border-t border-sand" aria-labelledby="faq-title">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-4">
          <div data-reveal>
            <Eyebrow>Good questions</Eyebrow>
          </div>
          <h2 id="faq-title" data-reveal data-reveal-delay="0.08" className="display mt-6 text-[clamp(2.375rem,4.2vw,3.75rem)]">
            Ask us <em>anything.</em>
          </h2>
          <p data-reveal data-reveal-delay="0.12" className="mt-6 max-w-sm text-stone">
            Can&rsquo;t find what you&rsquo;re looking for? Our concierge answers in seconds, or talk to a person any
            time.
          </p>
          <div data-reveal data-reveal-delay="0.16" className="mt-8 flex flex-wrap gap-3">
            <OpenChatButton className="btn btn-ink">Ask the concierge</OpenChatButton>
            <Link href="/faq" className="btn btn-ghost">
              All FAQs <Icon name="arrow" size={16} className="btn-arrow" />
            </Link>
          </div>
        </div>
        <div data-reveal className="lg:col-span-7 lg:col-start-6">
          <Accordion items={business.faqs.slice(0, 4)} />
        </div>
      </div>
    </section>
  );
}
