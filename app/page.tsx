import { Hero } from "@/components/home/Hero";
import { ProofStrip } from "@/components/home/ProofStrip";
import { ServicesIndex } from "@/components/home/ServicesIndex";
import { Approach } from "@/components/home/Approach";
import { Process } from "@/components/home/Process";
import { PromiseSection } from "@/components/home/PromiseSection";
import { Reviews } from "@/components/home/Reviews";
import { FaqPreview } from "@/components/home/FaqPreview";
import { QuoteSection } from "@/components/sections/QuoteSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <ServicesIndex />
      <Approach />
      <Process />
      <PromiseSection />
      <Reviews />
      <FaqPreview />
      <QuoteSection />
    </>
  );
}
