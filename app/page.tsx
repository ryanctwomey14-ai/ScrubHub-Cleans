import { business } from "@/content/business";
import { QuoteAgent } from "@/components/quote/QuoteAgent";
import { DarkHero } from "@/components/sections/DarkHero";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ReviewMarquee } from "@/components/sections/ReviewMarquee";
import { Steps } from "@/components/sections/Steps";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { ReviewsBlock } from "@/components/sections/ReviewsBlock";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <DarkHero
        size="home"
        eyebrow={`Trusted by your ${business.location.city} neighbors`}
        title={
          <>
            {business.stats.homesCleanedPhrase} {business.location.city} <br className="hidden sm:block" />
            Homes Cleaned. <br className="hidden sm:block" />
            <em className="lg:whitespace-nowrap">Every One Guaranteed.</em>
          </>
        }
        lede={`The cleaning company your ${business.location.city} neighbors trust with their homes, their families, and their keys. Tailored to how you live, and if we ever miss a spot, we're back within 24 hours to make it right.`}
        photoBrief="Wide shot of a bright, freshly cleaned living room with a ScrubHub cleaner in a branded shirt adding a final touch. Keep the left third calm for text."
        image={{
          src: "/photos/hero-before-after.jpg",
          alt: "Before and after: the same large living room, cluttered on the left and professionally cleaned on the right",
        }}
        form={<QuoteAgent />}
      />
      <FeatureCards />
      <ReviewMarquee />
      <ServicesGrid />
      <Steps />
      <GuaranteeBand />
      <ReviewsBlock />
      <FinalCta />
    </>
  );
}
