/**
 * Minimal in-memory sliding-window rate limiter.
 * Good enough to stop casual abuse and runaway costs. On Vercel each server
 * instance keeps its own memory, so for strict limits at scale swap this for
 * a shared store (e.g. Upstash Redis) behind the same function signature.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    hits.set(key, recent);
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    return { ok: false as const, retryAfter };
  }
  recent.push(now);
  hits.set(key, recent);

  // Opportunistic cleanup so the map can't grow forever.
  if (hits.size > 5000) {
    for (const [k, v] of hits) {
      if (!v.some((t) => now - t < windowMs)) hits.delete(k);
    }
  }
  return { ok: true as const };
}

export function clientKey(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anonymous";
}
