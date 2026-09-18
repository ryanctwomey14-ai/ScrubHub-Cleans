import { NextResponse } from "next/server";
import { deliverLead, parseLead } from "@/lib/leads";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // A single quote-assistant session can send quoted + booked/abandoned events.
  const limit = rateLimit(`lead:${clientKey(req)}`, 15, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please call or text us instead." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill this field.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const { lead, error } = parseLead(body);
  if (!lead) return NextResponse.json({ ok: false, error }, { status: 422 });

  try {
    await deliverLead(lead);
  } catch (err) {
    console.error("[lead] delivery failed", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong sending your details. Please call or text us." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
