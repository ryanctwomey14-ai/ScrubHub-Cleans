import { business, type ServiceSlug } from "@/content/business";
import { pricing } from "@/content/pricing";

export interface QuoteInput {
  service: ServiceSlug;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: string;
  condition?: string;
  addOns?: string[];
  frequency?: string;
  sizeTier?: string;
}

export interface QuoteLine {
  label: string;
  amount: number;
}

export interface Quote {
  service: ServiceSlug;
  serviceName: string;
  kind: "exact" | "range" | "startingAt";
  low: number;
  high: number;
  unit: string;
  /** Line-item breakdown so the price feels earned, not invented. */
  lines: QuoteLine[];
  /** For recurring plans: the one-time price, used as the anchor. */
  oneTime?: number;
  /** Savings per visit versus one-time. */
  savings?: number;
  discountPct?: number;
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
      lines: [{ label: `Commercial clean · ${tier.label}`, amount: tier.startingAt }],
      placeholder: pricing.placeholder,
    };
  }

  const rates = pricing.residential[input.service as keyof typeof pricing.residential];
  if (!rates) return null;

  const beds = Math.max(0, Math.min(input.bedrooms ?? 1, 8));
  const baths = Math.max(1, Math.min(input.bathrooms ?? 1, 8));
  const sqft = pricing.sqftTiers.find((t) => t.label === input.sqft);
  const condition = pricing.conditions.find((c) => c.id === input.condition) ?? pricing.conditions[0];
  const addOns = pricing.addOns.filter((a) => input.addOns?.includes(a.id));

  const baseClean = rates.base + beds * rates.perBedroom + baths * rates.perBathroom + (sqft?.add ?? 0);
  const conditionAdj = round5(baseClean * (condition.multiplier - 1));
  const addOnTotal = addOns.reduce((sum, a) => sum + a.price, 0);
  const oneTimeTotal = round5(baseClean) + conditionAdj + addOnTotal;

  const lines: QuoteLine[] = [
    {
      label: `${service.shortName} · ${beds === 0 ? "Studio" : `${beds} bed`} · ${baths} bath${sqft ? ` · ${sqft.label} sq ft` : ""}`,
      amount: round5(baseClean),
    },
  ];
  if (conditionAdj > 0) lines.push({ label: `Condition: ${condition.label.toLowerCase()}`, amount: conditionAdj });
  addOns.forEach((a) => lines.push({ label: a.label, amount: a.price }));

  let total = oneTimeTotal;
  let discountPct: number | undefined;
  if (input.service === "maintenance-cleaning") {
    const freq = pricing.frequencies.find((f) => f.label === input.frequency);
    if (freq && freq.discount > 0) {
      discountPct = Math.round(freq.discount * 100);
      const discount = round5(oneTimeTotal * freq.discount);
      total = oneTimeTotal - discount;
      lines.push({ label: `${freq.label} plan savings (${discountPct}%)`, amount: -discount });
    }
  }

  const unit =
    input.service === "maintenance-cleaning"
      ? input.frequency && input.frequency !== "One-time"
        ? "per visit"
        : "one-time"
      : input.service === "airbnb-turnover-cleaning"
        ? "per turnover"
        : "one-time";
  const exact = pricing.display === "exact";

  return {
    service: input.service,
    serviceName: service.name,
    kind: exact ? "exact" : "range",
    low: exact ? total : round5(total * (1 - pricing.spread)),
    high: exact ? total : round5(total * (1 + pricing.spread)),
    unit,
    lines,
    oneTime: discountPct ? oneTimeTotal : undefined,
    savings: discountPct ? oneTimeTotal - total : undefined,
    discountPct,
    placeholder: pricing.placeholder,
  };
}

export function formatQuote(q: Quote) {
  if (q.kind === "startingAt") return `From $${q.low}`;
  if (q.kind === "exact") return `$${q.low}`;
  return `$${q.low}–$${q.high}`;
}

export function inServiceArea(zip: string) {
  return pricing.serviceZipPrefixes.some((p) => zip.startsWith(p));
}
