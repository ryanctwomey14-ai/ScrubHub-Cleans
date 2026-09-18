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

### Conversion upgrades (value equation: outcome × likelihood ÷ time × effort)
- **Shared, saved conversation** (`lib/quote-store.ts`): one state for every assistant on the site, persisted in localStorage for the price-lock period; returning visitors get "Welcome back, {name}. Your $X price is still held."
- **Texted quote + resume link:** "quoted" leads include `customerText` and `resumeUrl` (AES-GCM token, `QUOTE_TOKEN_SECRET`, expires with the price lock). `/api/quote/resume` reopens the quote at the booking step. Your SMS automation sends `customerText`.
- **TCPA consent** line under the phone field (`smsConsent` in `content/pricing.ts`).
- **Live typed opening** leading with the outcome and the promise; ★ 4.8 in the card header.
- **Endowed progress:** bar starts ~18%, label "3 of 6 · ~15s".
- **Curiosity gap:** blurred price preview at the phone step; "Unlock my price" with a reason why.
- **Exact price** + recurring anchor (~~one-time~~, "You save $X every clean"), value stack, bonus and price lock (`offer`), review at the decision point.
- **Choice architecture:** Recommended frequency, 5 dates + "More dates", "Earliest" tag, earliest date on the Book button.
- **Mobile:** assistant sits directly under the headline; sticky "Instant price" scrolls to it.
- **Exit intent** (desktop, once per session) reminder with the held price.
- **Analytics:** `lib/track.ts` pushes quote_* events to GTM dataLayer / PostHog.

### Demo booking flow (client mockup, 2026-09-18)
service → bedrooms + bathrooms (one screen) → square feet → condition (4 levels) → frequency (maintenance: one-time or plan) → add-ons (checkboxes, no prices shown) → name, mobile, email, zip → **itemized exact quote** + **next available slot** → one-tap "Book this time" (or see other times) → "You're booked, confirmation link sent to your email" → **demo card step** ("Lock in my cleaner", $0 today, charged only after the job is done and you're happy) → done.
- Pricing: `content/pricing.ts` (base + per bed/bath + sq ft adder, × condition, + add-ons, − recurring %). All demo numbers.
- Card step is a mockup: inputs have no names, autofill off, nothing is sent; the lead records `cardOnFile: "demo"`. Live version: Stripe hosted card element + saved payment method, charged after the job.
- Lead stages now: quoted → booked → card_added (and abandoned → VA alert).

## Chatbot
Unchanged: Claude Haiku 4.5 via `/api/chat`; knowledge from `content/business.ts` + `content/chatbot-knowledge.md`; `[[LEAD_FORM]]` token opens the in-chat lead form; 500-character messages, 20 requests/10 min and 80/day per visitor.

## Photos to shoot
Each hero's `photoBrief` (and the About photo) describes the exact shot. Swap the navy stand-in in `DarkHero` for `<Image fill className="object-cover" />` once the photos exist.
