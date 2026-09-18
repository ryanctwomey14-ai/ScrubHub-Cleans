import type { Metadata } from "next";
import { business, cityLabel } from "@/content/business";
import { QuoteAgent } from "@/components/quote/QuoteAgent";
import { DarkHero } from "@/components/sections/DarkHero";
import { ReviewsBlock } from "@/components/sections/ReviewsBlock";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { FinalCta } from "@/components/sections/FinalCta";

export const metadata: Metadata = {
  title: "Client Reviews",
  description: `${business.name} is rated ${business.rating.value} stars from ${business.rating.count} reviews across ${cityLabel}. See why clients stay with us.`,
  alternates: { canonical: "/reviews" },
};

export default function ReviewsPage() {
  return (
    <>
      <DarkHero
        eyebrow="Client reviews"
        title={
          <>
            {business.rating.value} Stars From <em>{business.rating.count} Reviews</em>
          </>
        }
        lede="We earn every review the same way: we listen, tailor the clean, and make it right if anything's missed."
        photoBrief="A happy client at their front door waving goodbye to a ScrubHub cleaner. Candid, warm light."
        crumbs={[{ href: "/reviews", label: "Reviews" }]}
        form={<QuoteAgent />}
      />
      <ReviewsBlock showLink={false} />
      <GuaranteeBand />
      <FinalCta
        title={
          <>
            Become Our Next <em>5-Star Review</em>
          </>
        }
      />
    </>
  );
}
