/** Shared by the chat UI and the API route. */
export const CHAT_LIMITS = {
  maxUserMessageLength: 500,
  maxHistory: 12,
  perVisitorPer10Min: 20,
  perVisitorPerDay: 80,
} as const;

/** The assistant appends this token when the visitor agrees to share details. */
export const LEAD_FORM_TOKEN = "[[LEAD_FORM]]";

/**
 * Fast, cost-efficient current Claude model.
 * Verified against the installed @anthropic-ai/sdk model list.
 */
export const CHAT_MODEL = "claude-haiku-4-5-20251001";

export const QUICK_REPLIES = [
  "Get a quote",
  "What's included in a deep clean?",
  "Do you serve my area?",
  "What if something gets missed?",
] as const;
