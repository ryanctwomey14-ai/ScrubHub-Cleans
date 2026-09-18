import { business } from "@/content/business";
import { QuoteAgent } from "@/components/quote/QuoteAgent";
import { DarkHero } from "@/components/sections/DarkHero";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { ReviewMarquee } from "@/components/sections/ReviewMarquee";
import { Steps } from "@/components/sections/Steps";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { Objections } from "@/components/sections/Objections";
import { HeroOffer } from "@/components/sections/HeroOffer";
import { ServiceArea } from "@/components/sections/ServiceArea";
import { FinalCta } from "@/components/sections/FinalCta";

/** The homepage body. Also served, without navigation, at /get-quote for paid traffic. */
export function HomeLanding() {
  return (
    <>
      <DarkHero
        size="home"
        title={
          <>
            {business.stats.homesCleanedPhrase} {business.location.city} <br className="hidden sm:block" />
            Homes Cleaned. <br className="hidden sm:block" />
            <em className="lg:whitespace-nowrap">Every One Guaranteed.</em>
          </>
        }
        lede={`The cleaning company your ${business.location.city} neighbors trust with their homes and their keys. See your exact price in 60 seconds and grab the next open spot.`}
        photoBrief="Wide shot of a bright, freshly cleaned living room with a ScrubHub cleaner in a branded shirt adding a final touch. Keep the left third calm for text."
        image={{
          src: "/photos/hero-before-after.jpg",
          alt: "Before and after: the same large living room, cluttered on the left and professionally cleaned on the right",
        }}
        form={<QuoteAgent />}
      >
        <HeroOffer />
      </DarkHero>
      <ReviewMarquee overlapHero showHeader={false} />
      <ServicesGrid compact />
      <ServiceArea />
      <Steps />
      <GuaranteeBand />
      <Objections />
      <FinalCta />
    </>
  );
}
