# ScrubHub Cleans: Site Map & Build Plan

Direction: **"Bold conversion"** (see CLAUDE.md). One goal everywhere: get a quote request, call, or text.

## Page pattern
Every page = **DarkHero with QuoteForm** → only what that page needs → proof (guarantee and/or reviews) → **FinalCta** (form again) → footer.

| Route | Sections after the hero |
|---|---|
| `/` | FeatureCards (overlapping) · ServicesGrid · Steps · GuaranteeBand · ReviewsBlock · FinalCta |
| `/services` | ServicesGrid · GuaranteeBand · FinalCta |
| `/services/[slug]` (×5) | What's included + "great fit for" · GuaranteeBand · ReviewsBlock · FinalCta (service pre-selected) |
| `/about` | Short story + photo · FeatureCards · FinalCta |
| `/service-areas` | Areas card + "text your zip" · FinalCta |
| `/reviews` | ReviewsBlock · GuaranteeBand · FinalCta |
| `/faq` | Accordion + concierge card · FinalCta (FAQPage schema) |
| `/contact` | Hero with extended form + call/text/email chips · FeatureCards |
| `/api/chat`, `/api/lead` | Concierge streaming + lead intake |

## Components
- `components/sections`: DarkHero, FeatureCards, ServicesGrid, Steps, GuaranteeBand, ReviewsBlock, FinalCta
- `components/forms/QuoteForm`: short (name, phone, service, zip) or `extended` (+ email, notes)
- `components/layout`: Header (pill nav, phone, Get a Quote), Footer, MobileCTA (Call / Text / Get a quote)
- `components/chat`: ChatLauncher (lazy panel; steps aside over forms and the footer), ChatPanel, OpenChatButton
- `components/ui`: Icon (+ service icons), PhotoSlot, Accordion

## Instant quote assistant (every hero + final CTA)
`components/quote/QuoteAgent.tsx`: a guided, chat-style quote flow in a clear, direct Hormozi-style voice.
1. Service → bedrooms → bathrooms → frequency (maintenance only) → zip (coverage check). Commercial asks size instead.
2. **Contact before price:** "Your price is ready. Where should we text it?" (first name + mobile).
3. Price reveal from `content/pricing.ts` via `lib/quote.ts` (deterministic; never AI-generated), with a value stack and the 24-hour promise.
4. Book: pick a day (from `booking` rules) → arrival window → "Lock it in" (a booking *request*, confirmed by text).
- Lead events to `/api/lead`: `quoted` (price shown), `booked`, `abandoned`. The server recomputes the quote from the inputs.
- **VA alert (`abandoned`)** fires once if a quoted visitor leaves the page, navigates elsewhere on the site, or is idle for `booking.abandonAfterMs` (3 min) without booking. Sent to `VA_ALERT_WEBHOOK_URL` (falls back to `LEAD_WEBHOOK_URL`) with a "📞 CALL NOW" `text` line.
- "Sample pricing" badge shows while `pricing.placeholder` is true.

## Chatbot
Unchanged: Claude Haiku 4.5 via `/api/chat`; knowledge from `content/business.ts` + `content/chatbot-knowledge.md`; `[[LEAD_FORM]]` token opens the in-chat lead form; 500-character messages, 20 requests/10 min and 80/day per visitor.

## Photos to shoot
Each hero's `photoBrief` (and the About photo) describes the exact shot. Swap the navy stand-in in `DarkHero` for `<Image fill className="object-cover" />` once the photos exist.
