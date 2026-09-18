import { business } from "@/content/business";

export interface Lead {
  name: string;
  phone?: string;
  email?: string;
  zip?: string;
  service?: string;
  frequency?: string;
  message?: string;
  preferredContact?: string;
  source: "quote-form" | "chat" | "hero-bar";
  /** Last few chat turns, when the lead came from the concierge. */
  transcript?: { role: string; content: string }[];
  page?: string;
}

const clean = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : undefined;

export function parseLead(body: Record<string, unknown>): { lead?: Lead; error?: string } {
  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 160);
  const source = body.source === "chat" || body.source === "hero-bar" ? body.source : "quote-form";

  if (!name) return { error: "Please tell us your name." };
  if (!phone && !email) return { error: "Please add a phone number or email so we can reach you." };
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "That email doesn't look quite right." };
  if (phone && phone.replace(/\D/g, "").length < 10) return { error: "Please include a full phone number." };

  const serviceNames = business.services.map((s) => s.name);
  const service = clean(body.service, 80);

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

/**
 * Lead destination. Connect it later by setting LEAD_WEBHOOK_URL in .env.local
 * (works with Zapier, Make, GoHighLevel, Slack incoming webhooks, or any CRM
 * that accepts a JSON POST). Without it, leads are logged to the server console.
 */
export async function deliverLead(lead: Lead) {
  const payload = {
    ...lead,
    business: business.name,
    receivedAt: new Date().toISOString(),
  };

  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) {
    console.info("[lead] LEAD_WEBHOOK_URL not set. Lead received:\n", JSON.stringify(payload, null, 2));
    return;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Lead webhook responded ${res.status}`);
}
