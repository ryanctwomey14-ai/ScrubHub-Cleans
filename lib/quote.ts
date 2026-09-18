import { business, type ServiceSlug } from "@/content/business";
import { pricing } from "@/content/pricing";

export interface QuoteInput {
  service: ServiceSlug;
  bedrooms?: number;
  bathrooms?: number;
  frequency?: string;
  sizeTier?: string;
}

export interface Quote {
  service: ServiceSlug;
  serviceName: string;
  kind: "range" | "startingAt";
  low: number;
  high: number;
  unit: string;
  discountLabel?: string;
  placeholder: boolean;
}

const round5 = (n: number) => Math.round(n / 5) * 5;

/** Deterministic quote from content/pricing.ts. Shared by the UI and the lead API. */
export function estimate(input: QuoteInput): Quote | null {
  const service = business.services.find((s) => s.slug === input.service);
  if (!service) return null;

  if (input.service === "commercial-cleaning") {
    const tier = pricing.commercial.find((t) => t.label === input.sizeTier) ?? pricing.commercial[0];
    return {
      service: input.service,
      serviceName: service.name,
      kind: "startingAt",
      low: tier.startingAt,
      high: tier.startingAt,
      unit: "per visit",
      placeholder: pricing.placeholder,
    };
  }

  const rates = pricing.residential[input.service as keyof typeof pricing.residential];
  if (!rates) return null;
  const beds = Math.max(0, Math.min(input.bedrooms ?? 1, 8));
  const baths = Math.max(1, Math.min(input.bathrooms ?? 1, 8));
  let price = rates.base + beds * rates.perBedroom + baths * rates.perBathroom;

  let discountLabel: string | undefined;
  if (input.service === "maintenance-cleaning") {
    const freq = pricing.frequencies.find((f) => f.label === input.frequency);
    if (freq && freq.discount > 0) {
      price *= 1 - freq.discount;
      discountLabel = `${Math.round(freq.discount * 100)}% recurring discount applied`;
    }
  }

  return {
    service: input.service,
    serviceName: service.name,
    kind: "range",
    low: round5(price * (1 - pricing.spread)),
    high: round5(price * (1 + pricing.spread)),
    unit: input.service === "maintenance-cleaning" ? "per visit" : input.service === "airbnb-turnover-cleaning" ? "per turnover" : "one-time",
    discountLabel,
    placeholder: pricing.placeholder,
  };
}

export function formatQuote(q: Quote) {
  return q.kind === "startingAt" ? `From $${q.low}` : `$${q.low}–$${q.high}`;
}

export function inServiceArea(zip: string) {
  return pricing.serviceZipPrefixes.some((p) => zip.startsWith(p));
}
