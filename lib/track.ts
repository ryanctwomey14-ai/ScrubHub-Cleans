/**
 * Funnel events for the quote assistant. Pushes to Google Tag Manager's
 * dataLayer and PostHog if either is installed; logs to the console in dev.
 * Events: quote_view, quote_step, quote_contact_submitted, quote_shown,
 * quote_book_started, quote_booked, quote_abandoned, quote_resumed, quote_nudge_*.
 */
type W = Window & {
  dataLayer?: Record<string, unknown>[];
  posthog?: { capture: (e: string, p?: Record<string, unknown>) => void };
};

export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as W;
  w.dataLayer?.push({ event, ...props });
  w.posthog?.capture(event, props);
  if (process.env.NODE_ENV !== "production") console.debug("[track]", event, props);
}
