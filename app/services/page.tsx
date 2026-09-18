import type { Metadata } from "next";
import { business, cityLabel } from "@/content/business";
import { QuoteAgent } from "@/components/quote/QuoteAgent";
import { DarkHero } from "@/components/sections/DarkHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: `Cleaning Services in ${cityLabel}`,
  description: `Maintenance, deep, move-in/move-out, Airbnb turnover, and commercial cleaning in ${cityLabel}. Rated ${business.rating.value} stars. Get your quote in under a minute.`,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <DarkHero
        eyebrow={`Services · ${cityLabel}`}
        title={
          <>
            Cleaning Services <em>Built Around You</em>
          </>
        }
        lede="Five services, one standard. Choose yours, tell us about your space, and we'll send a quote tailored to it."
        photoBrief="Two ScrubHub cleaners in branded shirts arriving at a client's front door, smiling. Natural light."
        crumbs={[{ href: "/services", label: "Services" }]}
        form={<QuoteAgent />}
      />
      <ServicesGrid heading={false} />
      <GuaranteeBand />
      <FinalCta />
    </>
  );
}
