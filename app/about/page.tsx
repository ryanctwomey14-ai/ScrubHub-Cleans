import type { Metadata } from "next";
import { business, cityLabel } from "@/content/business";
import { QuoteAgent } from "@/components/quote/QuoteAgent";
import { DarkHero } from "@/components/sections/DarkHero";
import { FeatureCards } from "@/components/sections/FeatureCards";
import { FinalCta } from "@/components/sections/FinalCta";
import { PhotoSlot } from "@/components/ui/PhotoSlot";

export const metadata: Metadata = {
  title: "About Us",
  description: `${business.name} is a top-rated cleaning company in ${cityLabel}: client-first, tailored to every home, and backed by a 24-hour make-it-right promise.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <DarkHero
        eyebrow="About ScrubHub"
        title={
          <>
            Built on One Promise: <em>Make It Right</em>
          </>
        }
        lede="We put our clients first, adapt every clean to the home in front of us, and stand behind every visit."
        photoBrief="Team portrait of the owner and cleaners in branded shirts beside the company vehicle. Confident, relaxed, natural light."
        crumbs={[{ href: "/about", label: "About" }]}
        form={<QuoteAgent />}
      />

      <section className="section" aria-labelledby="story-title">
        <div className="shell grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <div data-reveal className="lg:col-span-5">
            <PhotoSlot
              tone="ink"
              brief="The owner, candid, doing a final walkthrough of a finished room with a client."
              className="aspect-[4/5] w-full rounded-2xl"
            />
          </div>
          <div className="lg:col-span-7">
            <p data-reveal className="eyebrow">Why we&rsquo;re different</p>
            <h2 id="story-title" data-reveal className="display h2 mt-4">
              Your Home Isn&rsquo;t a Checklist. <em>It&rsquo;s Yours.</em>
            </h2>
            <div data-reveal className="lede mt-6 space-y-5 text-stone">
              <p>
                There&rsquo;s no such thing as one-size-fits-all. We learn how you live and what matters most, then
                build every clean around it. There&rsquo;s a reason our clients stay with us for so long.
              </p>
              <p>
                And if something isn&rsquo;t right, we don&rsquo;t argue about it. We come back within{" "}
                {business.guarantee.hours} hours and fix it. {business.tagline}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="pb-4">
        <FeatureCards overlap={false} />
      </div>
      <FinalCta />
    </>
  );
}
