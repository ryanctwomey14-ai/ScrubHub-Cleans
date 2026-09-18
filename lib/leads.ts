import { business, type ServiceSlug } from "@/content/business";
import { booking as bookingRules, offer, pricing } from "@/content/pricing";
import { estimate, formatQuote, type Quote } from "@/lib/quote";
import { sealToken } from "@/lib/token";

/**
 * Lead lifecycle from the quote assistant:
 *   quoted    → saw a price (contact captured before the reveal)
 *   booked    → picked a date and arrival window
 *   abandoned → got a price but left or went quiet without booking → VA alert
 * Other sources (chat, plain forms) arrive as "inquiry".
 */
export type LeadStage = "inquiry" | "quoted" | "booked" | "abandoned";

export interface Lead {
  name: string;
  phone?: string;
  email?: string;
  zip?: string;
  service?: string;
  frequency?: string;
  message?: string;
  preferredContact?: string;
  source: "quote-form" | "chat" | "quote-agent";
  stage: LeadStage;
  /** Recomputed server-side from the inputs; client-sent prices are ignored. */
  quote?: Quote & {
    display: string;
    details: { bedrooms?: number; bathrooms?: number; frequency?: string; sizeTier?: string };
  };
  booking?: { date: string; window: string };
  /** Last few chat turns, when the lead came from the concierge. */
  transcript?: { role: string; content: string }[];
  page?: string;
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : undefined;

const num = (v: unknown) => (typeof v === "number" && Number.isFinite(v) ? v : undefined);

export interface ResumeData {
  service: ServiceSlug;
  bedrooms?: number;
  bathrooms?: number;
  frequency?: string;
  sizeTier?: string;
  zip?: string;
  name: string;
  phone: string;
}

/**
 * For "quoted" leads: an encrypted link that reopens the quote at the booking
 * step, and the text message your SMS automation should send the customer.
 */
export function customerFollowUp(lead: Lead) {
  if (lead.stage !== "quoted" || !lead.quote || !lead.phone) return undefined;
  const d = lead.quote.details;
  const token = sealToken(
    {
      service: lead.quote.service,
      bedrooms: d.bedrooms,
      bathrooms: d.bathrooms,
      frequency: d.frequency,
      sizeTier: d.sizeTier,
      zip: lead.zip,
      name: lead.name,
      phone: lead.phone,
    } satisfies ResumeData,
    offer.priceLockDays,
  );
  const resumeUrl = `${business.siteUrl}/?q=${token}#quote`;
  const first = lead.name.split(" ")[0];
  const price = `${lead.quote.display} ${lead.quote.unit}`;
  const customerText =
    lead.quote.kind === "startingAt"
      ? `Hi ${first}, it's ${business.name}. ${lead.quote.serviceName}: ${price}. Pick a walkthrough time here: ${resumeUrl} Reply STOP to opt out.`
      : `Hi ${first}, it's ${business.name}. Your ${lead.quote.serviceName.toLowerCase()} price: ${price}. Pick your day in 10 seconds: ${resumeUrl} Reply STOP to opt out.`;
  return { token, resumeUrl, customerText };
}

function parseQuote(raw: unknown): Lead["quote"] {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const slug = clean(r.service, 60) as ServiceSlug | undefined;
  if (!slug) return undefined;
  const details = {
    bedrooms: num(r.bedrooms),
    bathrooms: num(r.bathrooms),
    frequency: clean(r.frequency, 40),
    sizeTier: clean(r.sizeTier, 40),
  };
  const q = estimate({ service: slug, ...details });
  return q ? { ...q, display: formatQuote(q), details } : undefined;
}

function parseBooking(raw: unknown): Lead["booking"] {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  const date = clean(r.date, 10);
  const window = clean(r.window, 40);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !window || !bookingRules.windows.includes(window)) return undefined;
  return { date, window };
}

export function parseLead(body: Record<string, unknown>): { lead?: Lead; error?: string } {
  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 160);
  const source = body.source === "chat" || body.source === "quote-agent" ? body.source : "quote-form";
  const stage: LeadStage =
    body.stage === "quoted" || body.stage === "booked" || body.stage === "abandoned" ? body.stage : "inquiry";

  if (!name) return { error: "Please tell us your name." };
  if (!phone && !email) return { error: "Please add a phone number or email so we can reach you." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "That email doesn't look quite right." };
  if (phone && phone.replace(/\D/g, "").length < 10) return { error: "Please include a full 10-digit phone number." };

  const serviceNames = business.services.map((s) => s.name);
  const service = clean(body.service, 80);
  const booking = stage === "booked" ? parseBooking(body.booking) : undefined;
  if (stage === "booked" && !booking) return { error: "Please pick a date and time." };

  return {
    lead: {
      name,
      phone,
      email,
      zip: clean(body.zip, 10),
      service: service && (serviceNames.includes(service) || service === "Not sure yet") ? service : undefined,
      frequency: clean(body.frequency, 40),
      message: clean(body.message, 2000),
      preferredContact: clean(body.preferredContact, 20),
      source,
      stage,
      quote: parseQuote(body.quote),
      booking,
      page: clean(body.page, 200),
      transcript: Array.isArray(body.transcript)
        ? body.transcript
            .slice(-10)
            .map((m: { role?: unknown; content?: unknown }) => ({
              role: m.role === "assistant" ? "assistant" : "user",
              content: clean(m.content, 800) ?? "",
            }))
        : undefined,
    },
  };
}

function headline(lead: Lead) {
  const who = `${lead.name} (${lead.phone ?? lead.email})`;
  const what = lead.quote ? `${lead.quote.serviceName}, quoted ${lead.quote.display} ${lead.quote.unit}` : lead.service ?? "general inquiry";
  switch (lead.stage) {
    case "abandoned":
      return `📞 CALL NOW: ${who} got a quote but did NOT book. ${what}.`;
    case "booked":
      return `✅ Booking request: ${who}, ${what}, ${lead.booking?.date} ${lead.booking?.window}. Text to confirm.`;
    case "quoted":
      return `💬 New quote: ${who}, ${what}.`;
    default:
      return `New lead: ${who}, ${what}.`;
  }
}

async function post(url: string, payload: object) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
}

/**
 * Destinations (set in .env.local; all accept a JSON POST, e.g. Zapier, Make,
 * GoHighLevel, or a Slack incoming webhook, which will display `text`):
 *   LEAD_WEBHOOK_URL      every lead (CRM / sheet)
 *   VA_ALERT_WEBHOOK_URL  "call now" alerts for quoted-but-not-booked visitors
 *                         (falls back to LEAD_WEBHOOK_URL)
 * Without either, everything is logged to the server console.
 */
export async function deliverLead(lead: Lead, followUp?: ReturnType<typeof customerFollowUp>) {
  const payload = {
    text: headline(lead),
    ...lead,
    // For your SMS automation: send `customerText` to `phone` when stage = "quoted".
    customerText: followUp?.customerText,
    resumeUrl: followUp?.resumeUrl,
    samplePricing: pricing.placeholder || undefined,
    business: business.name,
    receivedAt: new Date().toISOString(),
  };

  const leadUrl = process.env.LEAD_WEBHOOK_URL;
  const alertUrl = process.env.VA_ALERT_WEBHOOK_URL || leadUrl;
  const url = lead.stage === "abandoned" ? alertUrl : leadUrl;

  if (!url) {
    console.info(`[lead:${lead.stage}] ${payload.text}\n`, JSON.stringify(payload, null, 2));
    return;
  }
  await post(url, payload);
}
