import Anthropic from "@anthropic-ai/sdk";
import { business } from "@/content/business";
import { CHAT_LIMITS, CHAT_MODEL } from "@/lib/chat/config";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { clientKey, rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const FALLBACK = `Thanks for reaching out. I'm still being set up, so I'll have full details here soon. In the meantime, the team would love to help: call or text ${business.contact.phoneDisplay}, or email ${business.contact.email}. They're available 24/7.`;

function textStream(text: string, status = 200) {
  return new Response(text, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
  });
}

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== "object" || !Array.isArray((body as { messages?: unknown }).messages)) return null;
  const raw = (body as { messages: unknown[] }).messages.slice(-CHAT_LIMITS.maxHistory);

  const messages: ChatMessage[] = [];
  for (const m of raw) {
    if (!m || typeof m !== "object") return null;
    const { role, content } = m as { role?: unknown; content?: unknown };
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") return null;
    const trimmed = content.trim();
    if (!trimmed) continue;
    if (role === "user" && trimmed.length > CHAT_LIMITS.maxUserMessageLength) return null;
    messages.push({ role, content: trimmed.slice(0, 4000) });
  }

  // The API expects the conversation to start with a user turn and end with one.
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return null;
  return messages;
}

export async function POST(req: Request) {
  const key = clientKey(req);
  const burst = rateLimit(`chat:10m:${key}`, CHAT_LIMITS.perVisitorPer10Min, 10 * 60_000);
  const daily = rateLimit(`chat:day:${key}`, CHAT_LIMITS.perVisitorPerDay, 24 * 60 * 60_000);
  if (!burst.ok || !daily.ok) {
    return textStream(
      `You've sent quite a few messages, so let's get you to a real person. Call or text ${business.contact.phoneDisplay} any time.`,
      429,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return textStream("Sorry, I couldn't read that message.", 400);
  }

  const messages = parseMessages(body);
  if (!messages) {
    return textStream(
      `Please keep messages under ${CHAT_LIMITS.maxUserMessageLength} characters and try again.`,
      400,
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return textStream(FALLBACK);
  }

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const response = client.messages.stream({
          model: CHAT_MODEL,
          max_tokens: 450,
          temperature: 0.4,
          system: buildSystemPrompt(),
          messages,
        });

        for await (const event of response) {
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        console.error("[chat] Anthropic error", err);
        controller.enqueue(
          encoder.encode(
            `\n\nSorry, I'm having trouble right now. Please call or text ${business.contact.phoneDisplay} and the team will help straight away.`,
          ),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
