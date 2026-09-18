# ScrubHub Cleans: Build Plan & Map

Direction: **B, "Porcelain"** (see CLAUDE.md for palette, type, and motion).

## Sitemap
| Route | Purpose |
|---|---|
| `/` | Homepage: full conversion story |
| `/services` | All five services |
| `/services/[slug]` | One page per service (maintenance, deep, move-in/out, Airbnb, commercial) |
| `/about` | Philosophy, commitments, proof |
| `/service-areas` | Pittsburgh coverage + "text your zip" |
| `/reviews` | Rating + testimonials |
| `/faq` | Full FAQ (+ FAQPage schema) |
| `/contact` | Quote form (pre-fills `?service=` and `?zip=` from the hero bar) |
| `/api/chat` | Streaming concierge (Anthropic, server-side) |
| `/api/lead` | Lead intake → `LEAD_WEBHOOK_URL` |

## Homepage sections (order) and motion
1. **Hero**: split headline + arch photo, rating, CTAs, floating promise card, overlapping quote bar. *Masked line-rise headline; arch opens from an inset clip while the photo settles from 1.14×.*
2. **Proof strip**: 4.8★ · 160 reviews · 24h promise · 24/7. *Staggered fade-up.*
3. **Services index**: editorial numbered rows. *Hover wash + arrow fill.*
4. **Approach**: "no one-size-fits-all" + three commitments. *Scroll reveals.*
5. **Process**: three steps. *Connecting hairline draws on scroll (scrubbed).*
6. **Promise** (navy): *pinned on desktop; clock hand sweeps 360°, arc fills, three beats light up.*
7. **Reviews**: big 4.8 + cards (samples flagged).
8. **FAQ preview**: accordion + "Ask the concierge".
9. **Quote section**: contact channels + full form.

## Components
- `components/layout`: Header (floating on scroll, hides on scroll-down), Footer (navy), MobileCTA (Call / Text / Quote)
- `components/home`: Hero, QuoteBar, ProofStrip, ServicesIndex, Approach, Process, PromiseSection, Reviews, FaqPreview
- `components/sections`: PageHero, CtaBand, QuoteSection
- `components/ui`: Icon/Stars, PhotoSlot (labelled photo placeholders), SectionIntro/Eyebrow, Accordion, ReviewCard
- `components/forms/QuoteForm`
- `components/chat`: ChatLauncher (lazy-loads the panel), ChatPanel, OpenChatButton
- `components/providers/MotionProvider`: Lenis + GSAP ticker + `[data-reveal]` scroll reveals

## Chatbot
- Launcher appears after 1.6s; steps aside over forms and the footer (`data-chat-avoid`); sits above the mobile CTA.
- Panel: desktop floating card; mobile full-screen **above** the sticky CTA bar.
- `/api/chat` streams plain text from `claude-haiku-4-5-20251001`; prompt built from `content/business.ts` + `content/chatbot-knowledge.md`.
- Guardrails in the system prompt; `[PLACEHOLDER]` knowledge sections are treated as unknown.
- Lead capture: the model emits `[[LEAD_FORM]]` → an inline form posts to `/api/lead` with the transcript.
- Protection: 500-character messages, 12-message history, 20 requests/10 min and 80/day per visitor, `max_tokens` 450.

## Key files
- `content/business.ts`: every business fact (single source of truth)
- `content/chatbot-knowledge.md`: concierge knowledge base (client fills in)
- `lib/schema.tsx`: LocalBusiness JSON-LD · `app/sitemap.ts` · `app/robots.ts` · `app/opengraph-image.tsx`
- `.env.example`: environment variables to set
