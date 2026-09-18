import type { Metadata } from "next";
import { business, cityLabel } from "@/content/business";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { DarkHero } from "@/components/sections/DarkHero";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: `Get your cleaning quote from ${business.name} in ${cityLabel}. Call or text ${business.contact.phoneDisplay} any time, or send the form.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage(props: PageProps<"/contact">) {
  const params = await props.searchParams;
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const service = pick(params.service);
  const validService = business.services.some((s) => s.name === service) ? service : "";

  const channels = [
    { icon: "phone" as const, label: "Call", value: business.contact.phoneDisplay, href: business.contact.phoneHref },
    { icon: "message" as const, label: "Text", value: business.contact.phoneDisplay, href: business.contact.smsHref },
    { icon: "mail" as const, label: "Email", value: business.contact.email, href: business.contact.emailHref },
  ];

  return (
    <>
      <DarkHero
        size="home"
        eyebrow="Get a quote"
        title={
          <>
            Your Quote in <em>Under a Minute</em>
          </>
        }
        lede="Tell us what you need and where. We'll tailor a quote to your space. Rather talk? We're available 24/7."
        photoBrief="A ScrubHub cleaner at a client's door with a friendly wave, ready to start."
        form={<QuoteForm extended defaultService={validService} defaultZip={pick(params.zip).replace(/[^\d-]/g, "").slice(0, 10)} />}
      >
        <ul className="grid w-full gap-3 sm:grid-cols-3 lg:max-w-xl">
          {channels.map((c) => (
            <li key={c.label}>
              <a
                href={c.href}
                className="flex h-full min-w-0 flex-col gap-1 rounded-xl bg-white/[0.07] p-4 ring-1 ring-white/12 transition-colors hover:bg-white/12"
              >
                <span className="flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-mist">
                  <Icon name={c.icon} size={15} /> {c.label}
                </span>
                <span className="truncate font-bold">{c.value}</span>
              </a>
            </li>
          ))}
        </ul>
      </DarkHero>
      <div className="pb-24">
        <FeatureCards />
      </div>
    </>
  );
}
