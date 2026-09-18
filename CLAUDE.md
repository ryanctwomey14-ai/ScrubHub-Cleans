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

## Chosen design direction: B — "Porcelain" (approved 2026-09-18)
- **Mood:** bright, airy, gallery-like; premium hospitality. Reads as clean and trustworthy.
- **Palette:** Porcelain `#F7F5F0` (base) · Linen `#ECE7DD` (alternate surfaces) · Ink Navy `#0F1D3A` (all text; footer and chat panel backgrounds) · Hub Blue `#1F6FFF` (primary buttons only) · Stone `#6E6A62` (secondary text) · Glint Cyan `#3FD8F2` (focus states and chat accents only)
- **Type:** Fraunces for display (soft optical size, quirky alternates off) + Manrope for body/UI.
- **Hero:** asymmetric split. Large headline left with the 4.8★ / 160 reviews line; tall rounded-arch photo of a sunlit finished room right; slim "instant quote" bar (service, zip, button) overlapping the hero's bottom edge.
- **Signature motion:** masked line-by-line headline rise + arch frame opening and settling from a slight zoom; later, a scroll-pinned "24-hour make-it-right" moment with a clock hand sweeping a full circle.
- **Principles carried from the references:** one accent on a restrained base; contact/quote always reachable; layered elements that bridge sections; proof right after the fold; big numerals as trust; a three-step process; framed imagery.
- **Logo:** the logo's sparkle is the only sparkle on the site. A transparent/SVG logo is required for light backgrounds.

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
- **Phase 2 — Plan:** waiting on the premium-cleaning-site skill contents (it defines the homepage section order) before writing PLAN.md.
- **Open items:** premium-cleaning-site SKILL.md is empty (contents pending); confirm Pittsburg vs Pittsburgh; theme-factory skill not installed; Context7 MCP loads on next session start; vector logo needed.
