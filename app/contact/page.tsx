import type { Metadata } from "next";
import { business, cityLabel } from "@/content/business";
import { QuoteSection } from "@/components/sections/QuoteSection";

export const metadata: Metadata = {
  title: "Get a Quote",
  description: `Request a cleaning quote from ${business.name} in ${cityLabel}. Call or text ${business.contact.phoneDisplay} any time, or send the form.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage(props: PageProps<"/contact">) {
  const params = await props.searchParams;
  const pick = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";
  const service = pick(params.service);
  const validService = business.services.some((s) => s.name === service) ? service : "";

  return (
    <div className="pt-20 md:pt-24">
      <QuoteSection
        headingLevel="h1"
        defaultService={validService}
        defaultZip={pick(params.zip).replace(/[^\d-]/g, "").slice(0, 10)}
        title={
          <>
            Your quote, <em>tailored.</em>
          </>
        }
      />
    </div>
  );
}
