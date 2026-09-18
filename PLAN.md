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

## Chatbot
Unchanged: Claude Haiku 4.5 via `/api/chat`; knowledge from `content/business.ts` + `content/chatbot-knowledge.md`; `[[LEAD_FORM]]` token opens the in-chat lead form; 500-character messages, 20 requests/10 min and 80/day per visitor.

## Photos to shoot
Each hero's `photoBrief` (and the About photo) describes the exact shot. Swap the navy stand-in in `DarkHero` for `<Image fill className="object-cover" />` once the photos exist.
