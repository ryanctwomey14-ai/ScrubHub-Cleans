import "server-only";
import crypto from "node:crypto";

/**
 * Encrypted, expiring tokens for the "resume your quote" link we text to
 * customers. AES-256-GCM, so the name/phone inside are never readable in the
 * URL. Set QUOTE_TOKEN_SECRET in production.
 */
function key() {
  const secret = process.env.QUOTE_TOKEN_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    console.warn("[token] QUOTE_TOKEN_SECRET is not set; using an insecure fallback.");
  }
  return crypto.createHash("sha256").update(secret ?? "scrubhub-dev-only-secret").digest();
}

export function sealToken(data: object, ttlDays: number) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const body = JSON.stringify({ d: data, exp: Date.now() + ttlDays * 86_400_000 });
  const enc = Buffer.concat([cipher.update(body, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), enc]).toString("base64url");
}

export function openToken<T>(token: string): T | null {
  try {
    const raw = Buffer.from(token, "base64url");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    const body = JSON.parse(Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8"));
    if (typeof body.exp !== "number" || body.exp < Date.now()) return null;
    return body.d as T;
  } catch {
    return null;
  }
}
