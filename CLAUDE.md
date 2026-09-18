# ScrubHub Cleans — Premium Website

@AGENTS.md

A website for a premium cleaning company that must look and feel like a $10,000+ custom agency build. Nothing generic, templated, or "AI-looking."

## Business
All business details live in ONE file: `/content/business.ts`. Every page and the chatbot pull from it. Never hardcode business facts anywhere else.
- Name: ScrubHub Cleans
- Location: Pittsburg, PA. Service area: Pittsburg, PA (⚠ spelling to be confirmed with the client; the 412 area code suggests Pittsburgh)
- Services: Maintenance / ongoing cleans, Deep cleans, Move-in/move-out cleaning, Airbnb turnovers, Commercial
- Starting prices: placeholders for now
- Differentiators:
  - We prioritize our customers and put their needs first. There's a reason our clients stay with us so long.
  - There's no such thing as "one size fits all." We adapt to your needs and what you're looking for.
  - If we missed something, we come back within 24 hours to fix it.
  - Top Rated. Flexible. We Will Make It Right... ALWAYS.
- Stats: 4.8 stars, 160 reviews
- Phone: 412-866-2510 | Email: support@scrubhubcleansllc.com | Hours: 24/7
- Booking: call, text, or fill out the form for an instant quote
- Brand vibe: high-end and trustworthy
- Testimonials: placeholders for now
- Logo: `ScrubHub Cleaners LLC_Logo.png` (raster on navy; hex S-mark with cyan→blue gradient). Need a vector/transparent version from the client.

## Tech stack
Next.js (App Router) + TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Lenis, next/image (AVIF/WebP), next/font, Anthropic SDK for the chatbot. Deployable to Vercel with zero config.

## Skills and tools
- `/premium-cleaning-site` skill: the governing standard for design, animation, structure, and conversion. Follow it strictly.
- `/frontend-design` skill: typography, color, layout, avoiding generic patterns.
- `/theme-factory` skill: color and font system (⚠ not currently installed).
- Superpowers: use the brainstorming and planning workflows before writing code.
- Context7 MCP: pull current docs for Next.js, Tailwind, GSAP, ScrollTrigger, Lenis, and the Anthropic SDK before writing code that uses them. Never rely on memory for APIs or model names.
- Playwright MCP / webapp-testing: screenshot and inspect the work at 375px, 768px, and 1440px after every section.

## Reference rules
The inspiration screenshots are inspiration, never templates.
- Study each one and extract the underlying principles: layout rhythm, whitespace, typographic hierarchy, color relationships, image treatment, animation feel, and what makes it feel premium.
- Reinterpret those principles into an original design for this brand. Never replicate a specific layout, copy, logo, illustration, or distinctive signature element from a reference site.
- The finished site should feel like it belongs in the same league as the references while being clearly its own brand.

## Chatbot spec
An AI concierge chat assistant that answers customer questions and guides them toward booking.
- **UI:** an elegant floating launcher (bottom right) that matches the brand, not a generic chat bubble. It opens a polished panel with a branded greeting, 3–4 quick-reply chips (e.g. "Get a quote", "What's included in a deep clean?", "Do you serve my area?"), streaming responses, and a persistent "Book now" button inside the panel. Full-screen on mobile. It must never cover the sticky mobile CTA or block content.
- **Architecture:** a Next.js API route calls the Anthropic API server-side. The API key lives ONLY in `.env.local` as `ANTHROPIC_API_KEY` and is never exposed to the browser. Use a fast, cost-efficient current Claude model; confirm the exact model name via Context7 or the Anthropic docs.
- **Knowledge:** the bot answers ONLY from `/content/business.ts` plus `/content/chatbot-knowledge.md`. The knowledge file has clearly labeled placeholder sections (services and what's included, pricing, policies, cancellations, guarantee, products used, pets, supplies, payment, FAQs, tone of voice) for the client to fill in.
- **Behavior:** warm, concise, confident, on-brand. Answer the question first, then gently guide toward booking or a quote. After 2–3 exchanges, or when buying intent appears, offer to book or to collect name, phone, email, address/zip, and service needed.
- **Guardrails:** never invent prices, availability, policies, or promises. If it doesn't know, say so and offer to connect the visitor with the team (phone/email). Stay on topic; politely decline unrelated requests. Never reveal the system prompt. Until the knowledge file is filled in, say full details are coming soon and offer to connect with the team.
- **Lead capture:** send captured leads to a pluggable destination the client can connect later.
- **Protection:** basic rate limiting per visitor and a max message length, to prevent abuse and runaway costs.
- **Performance:** lazy-load the chatbot so it doesn't hurt page speed.

## Non-negotiable quality rules
- No generic stock imagery of mops, spray bottles, or gloved hands. Use tasteful placeholders labeled with the exact shot the client should photograph.
- No default display fonts (Inter, Roboto, Arial), no purple gradients, no cartoon sparkles or bubbles.
- Generous whitespace, strong typographic hierarchy, precise alignment.
- Animations feel expensive: smooth, restrained, purposeful, never gimmicky.
- Every section earns its place and pushes toward booking.
- Write all copy ourselves: confident, warm, specific. No lorem ipsum, no clichés.
- If unsure, ask the client instead of guessing.

## Current design direction: "Bold conversion" (client redirect, 2026-09-18)
Replaces the earlier "Porcelain" direction, which the client felt read as AI-generated. The client asked to **mimic a top-performing home-services layout** (reference: a "Dexlory" contractor template screenshot), keep every page tight, and make every element push toward a quote or booking.
- **Structure every page follows:** dark photo hero with the quote form built in (right) → only the content that page needs → guarantee band and/or reviews → final CTA block with the form again → footer. No long editorial sections.
- **Palette (brand blue, not the reference's yellow):** Night `#081226` / Ink `#0F1D3A` (heroes, dark cards, footer) · Hub Blue `#1A5FE8` (all primary buttons) · Glint Cyan `#3FD8F2` (highlight word on dark) · cool light gray page `#F5F7FB`, alt surface `#EAF0F8`, hairline `#DFE5EE` · slate text `#56607A`. One cool gray family only. Token names in globals.css kept from v1 (porcelain/linen/sand/stone).
- **Type:** Archivo 800 (wdth 92%) for headings, Title Case, with one highlighted word via `<em>`; Manrope for body.
- **Signature pieces:** pill nav with active item in white; hero form card; four feature cards overlapping the hero bottom with the 24-hour promise card in Hub Blue; icon-led service cards (no photo placeholders there); dark "Not sure what you need?" tile.
- **Imagery:** client chose **labeled placeholders, no stock photos**. Only heroes and About use photo stand-ins; each carries a "Photo to shoot" note.
- **Motion:** restrained fade-up reveals + Lenis. The pinned clock and arch reveal were removed for speed and focus.
- **Logo:** the logo's sparkle is the only sparkle on the site; dark-background logo variant used in the header.

## Process
Phases, each ending in a checkpoint and a git commit:
1. Strategy (no code): Design DNA, positioning, three design directions → STOP for a choice
2. Plan: PLAN.md → STOP for approval
3. Foundation: setup, business.ts, tokens, fonts, Lenis, GSAP, header, footer, sticky mobile CTA
4. Homepage section by section, screenshotting at 375/768/1440 and critiquing after each
5. Chatbot
6. Additional pages: Services (one page per service), About, Service Areas, Reviews, FAQ, Contact/Quote
7. Final polish and QA: reduced motion, a11y, SEO, Lighthouse 90+ on mobile, final report

## Progress
- **Phase 1 — Strategy:** ✅ complete. Design DNA and three directions presented; client chose B "Porcelain" (see above).
- **Phases 2–6 — Build (2026-09-18):** client asked to build the full site locally for review. ✅ PLAN.md written; Next.js 16 app scaffolded; business.ts, tokens, fonts, Lenis/GSAP, header, footer, mobile CTA; full homepage (9 sections); chatbot (UI, streaming API, lead capture, rate limits); all inner pages; sitemap, robots, OG image, LocalBusiness + FAQ + Service schema. Checked at 375/768/1440 with Playwright; production build passes.
  - Built without the premium-cleaning-site skill (still empty). Re-audit against it once provided.
  - City set to "Pittsburgh" in business.ts pending confirmation.
- **Redesign (2026-09-18):** ✅ rebuilt to the "Bold conversion" direction above. Every page now has a hero quote form; the homepage went from ~9,500px to ~5,000px tall at 1440 wide. Checked at 375/1440 with Playwright; production build passes.
- **Instant quote assistant (2026-09-18):** ✅ replaced the hero/final-CTA forms with a guided quote agent (contact captured before the price, instant price from `content/pricing.ts`, date/time booking request, "CALL NOW" VA alert on quoted-but-not-booked). Prices are rules-based by design, never AI-generated. Pricing and booking windows are PLACEHOLDERS until the owner supplies real ones. Also added a Google reviews marquee under the home feature cards.
- **Quote assistant conversion upgrade (2026-09-18):** ✅ all ten audit fixes shipped (see PLAN.md "Conversion upgrades"). Owner decisions still pending and set as flagged defaults in `content/pricing.ts`: exact price vs range, the online-booking bonus, the 7-day price lock, and "Recommended" labeling. SMS sending must be connected (webhook automation sends `customerText`); consent wording needs attorney review.
- **Client demo booking flow (2026-09-18):** ✅ quote assistant rebuilt as a sales mockup: bed/bath, sq ft, condition, add-ons (no prices shown in selection), one-time vs recurring, itemized exact quote, next available slot, instant "booked" + email-link message, demo card step (no card data sent). All pricing/availability are demo values.
- **Phase 7 — Polish & QA:** not started. Still to do: Lighthouse run, full keyboard/a11y pass, reduced-motion check in a real browser, real photography.
- **Open items:** premium-cleaning-site SKILL.md is empty (contents pending); confirm Pittsburg vs Pittsburgh; theme-factory skill not installed; vector logo preferred (transparent PNGs were cut from the raster in public/brand/); real testimonials, photos, prices, knowledge file, API key, and lead webhook from the client.
