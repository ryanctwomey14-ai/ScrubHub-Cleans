import { NextResponse } from "next/server";
import type { ResumeData } from "@/lib/leads";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { openToken } from "@/lib/token";

export const runtime = "nodejs";

/** Reopens a quote from the texted link. Tokens are encrypted and expire with the price lock. */
export async function POST(req: Request) {
  const limit = rateLimit(`resume:${clientKey(req)}`, 20, 10 * 60_000);
  if (!limit.ok) return NextResponse.json({ ok: false }, { status: 429 });

  let token: unknown;
  try {
    token = ((await req.json()) as { token?: unknown }).token;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (typeof token !== "string" || token.length > 2000) return NextResponse.json({ ok: false }, { status: 400 });

  const data = openToken<ResumeData>(token);
  if (!data) return NextResponse.json({ ok: false, expired: true }, { status: 410 });
  return NextResponse.json({ ok: true, data });
}
