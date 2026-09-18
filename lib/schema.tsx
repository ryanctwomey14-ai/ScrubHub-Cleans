import { business } from "@/content/business";

/** schema.org LocalBusiness JSON-LD, built entirely from business.ts */
export function localBusinessSchema() {
  const url = business.siteUrl;
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${url}/#business`,
    name: business.name,
    legalName: business.legalName,
    description: business.description,
    url,
    logo: `${url}/brand/logo-on-light.png`,
    image: `${url}/opengraph-image`,
    telephone: business.contact.phoneE164,
    email: business.contact.email,
    priceRange: "$$",
    openingHours: business.hours.schema,
    address: {
      "@type": "PostalAddress",
      addressLocality: business.location.city,
      addressRegion: business.location.region,
      addressCountry: business.location.country,
    },
    areaServed: business.serviceAreas.map((name) => ({ "@type": "City", name })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: business.rating.value,
      reviewCount: business.rating.count,
      bestRating: 5,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Cleaning services",
      itemListElement: business.services.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: `${url}/services/${s.slug}` },
      })),
    },
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
