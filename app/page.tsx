import { cityLabel } from "@/content/business";
import { QuoteForm } from "@/components/forms/QuoteForm";
import { DarkHero } from "@/components/sections/DarkHero";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { Steps } from "@/components/sections/Steps";
import { GuaranteeBand } from "@/components/sections/GuaranteeBand";
import { ReviewsBlock } from "@/components/sections/ReviewsBlock";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <DarkHero
        size="home"
        eyebrow={`Top-rated in ${cityLabel}`}
        title={
          <>
            Spotless Cleaning, <br className="hidden sm:block" />
            <em className="whitespace-nowrap">Done Right.</em> Always.
          </>
        }
        lede={`Premium home and commercial cleaning in ${cityLabel}, tailored to how you live and backed by our 24-hour make-it-right promise.`}
        photoBrief="Wide shot of a bright, freshly cleaned living room with a ScrubHub cleaner in a branded shirt adding a final touch. Keep the left third calm for text."
        form={<QuoteForm />}
      />
      <FeatureCards />
      <ServicesGrid />
      <Steps />
      <GuaranteeBand />
      <ReviewsBlock />
      <FinalCta />
    </>
  );
}
