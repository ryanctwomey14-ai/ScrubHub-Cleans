"use client";

import { business, type ServiceSlug } from "@/content/business";
import { booking, offer, pricing } from "@/content/pricing";
import { estimate, formatQuote, inServiceArea, type Quote } from "@/lib/quote";
import { track } from "@/lib/track";

/**
 * One quote conversation shared by every assistant on the site (hero, final
 * CTA, exit nudge), saved to localStorage so progress survives refreshes and
 * page changes, and resumable from the link we text the customer.
 *
 * Flow (home services), a soft sell from the first tap:
 *   service (zero-risk micro-yes) → name, mobile, email (lead captured here)
 *   → bedrooms + bathrooms → square feet → condition → [frequency] → add-ons
 *   → zip → itemized price, shown in full + "want me to grab {next slot}?"
 *   → booked → card to lock in the cleaner (demo) → done
 */

export type Step =
  | "service" | "contact" | "size" | "rooms" | "sqft" | "condition" | "freq" | "addons" | "zip"
  | "quote" | "date" | "time" | "card" | "done";

export type Msg =
  | { id: number; from: "bot" | "user"; text: string }
  | { id: number; from: "bot"; card: "quote" | "review" | "booked" };

export interface Answers {
  service?: ServiceSlug;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: string;
  condition?: string;
  addOns?: string[];
  frequency?: string;
  sizeTier?: string;
  zip?: string;
  name?: string;
  phone?: string;
  email?: string;
  date?: string;
  window?: string;
}

export interface QuoteState {
  step: Step;
  messages: Msg[];
  answers: Answers;
  lead: Record<string, unknown> | null;
  leadAt?: number;
  quotedAt?: number;
  booked: boolean;
  cardAdded: boolean;
  alerted: boolean;
  updatedAt: number;
  /** Transient (not saved) */
  typing: boolean;
  started: boolean;
}

const KEY = "scrubhub-quote-v3";
const TTL = offer.priceLockDays * 86_400_000;

const fresh = (): QuoteState => ({
  step: "service",
  messages: [],
  answers: {},
  lead: null,
  booked: false,
  cardAdded: false,
  alerted: false,
  updatedAt: Date.now(),
  typing: false,
  started: false,
});

const SERVER_STATE = fresh();
let state: QuoteState = SERVER_STATE;
let loaded = false;
const listeners = new Set<() => void>();
let idleTimer: ReturnType<typeof setTimeout> | null = null;

/* ─── Store plumbing ─────────────────────────────────────────── */

function persist() {
  try {
    const { typing: _t, started: _s, ...saved } = state;
    void _t;
    void _s;
    localStorage.setItem(KEY, JSON.stringify(saved));
  } catch {
    /* private mode: fine, just no persistence */
  }
}

function set(patch: Partial<QuoteState> | ((s: QuoteState) => Partial<QuoteState>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next, updatedAt: Date.now() };
  persist();
  listeners.forEach((l) => l());
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const saved = JSON.parse(raw) as QuoteState;
      if (Date.now() - saved.updatedAt < TTL && Array.isArray(saved.messages)) {
        state = { ...fresh(), ...saved, typing: false, started: saved.messages.length > 0 };
      }
    }
  } catch {
    /* ignore corrupt storage */
  }
  window.addEventListener("pagehide", sendAbandoned);
}

let nextId = 1000;
const id = () => ++nextId;

function bumpIds() {
  const max = state.messages.reduce((m, x) => Math.max(m, x.id), 0);
  if (max >= nextId) nextId = max + 1;
}

export const quoteStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  get(): QuoteState {
    load();
    return state;
  },
  getServer(): QuoteState {
    return SERVER_STATE;
  },
};

/* ─── Derived ────────────────────────────────────────────────── */

export const serviceOf = (slug?: ServiceSlug) => business.services.find((s) => s.slug === slug);

export function currentQuote(a: Answers): Quote | null {
  if (!a.service) return null;
  return estimate({
    service: a.service,
    bedrooms: a.bedrooms,
    bathrooms: a.bathrooms,
    sqft: a.sqft,
    condition: a.condition,
    addOns: a.addOns,
    frequency: a.frequency,
    sizeTier: a.sizeTier,
  });
}

/** Questions for this visitor's path, used for "Question 2 of 6". */
export function questionPath(a: Answers): Step[] {
  if (a.service === "commercial-cleaning") return ["service", "contact", "size", "zip"];
  if (a.service === "maintenance-cleaning") return ["service", "contact", "rooms", "sqft", "condition", "freq", "addons", "zip"];
  return ["service", "contact", "rooms", "sqft", "condition", "addons", "zip"];
}

export function bookableDays() {
  const days: { iso: string; label: string; short: string; date: string }[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + booking.leadDays);
  while (days.length < booking.daysAhead) {
    if (!booking.closedWeekdays.includes(d.getDay())) {
      days.push({
        iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
        label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        short: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

/** DEMO: the first open slot. The live version reads real availability from the scheduling software. */
export function nextAvailable() {
  const day = bookableDays()[0];
  return { iso: day.iso, label: day.label, window: booking.windows[0] };
}

const dayLabel = (iso?: string) => bookableDays().find((d) => d.iso === iso)?.label ?? iso;

/* ─── Conversation helpers ───────────────────────────────────── */

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Add the visitor's answer, show "typing", then the bot's lines one at a time. */
async function say(user: string | null, bot: (string | Msg)[], next: Step) {
  set((s) => ({
    messages: user ? [...s.messages, { id: id(), from: "user", text: user }] : s.messages,
    typing: true,
    step: next,
  }));
  for (let i = 0; i < bot.length; i++) {
    await wait(i === 0 ? 450 : 360);
    const line = bot[i];
    const msg: Msg = typeof line === "string" ? { id: id(), from: "bot", text: line } : { ...line, id: id() };
    set((s) => ({ messages: [...s.messages, msg], typing: i < bot.length - 1 }));
  }
  if (!bot.length) set({ typing: false });
}

const card = (c: "quote" | "review" | "booked"): Msg => ({ id: 0, from: "bot", card: c });

function stepEvent(step: Step) {
  track("quote_step", { step, service: state.answers.service });
}

/* ─── Start / resume ─────────────────────────────────────────── */

let starting = false;

/** Called by each assistant on mount. The first one decides the opening. */
export async function ensureStarted(preset?: ServiceSlug) {
  load();
  if (starting) return;
  starting = true;
  bumpIds();

  const token = new URLSearchParams(window.location.search).get("q");
  if (token) {
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    window.history.replaceState(null, "", url.toString());
    if (await resumeFromToken(token)) return;
  }

  if (state.started) {
    // Returning visitor with a saved price they haven't booked yet.
    if (state.lead && !state.booked && !sessionStorage.getItem("scrubhub-welcomed")) {
      sessionStorage.setItem("scrubhub-welcomed", "1");
      const q = currentQuote(state.answers);
      const first = state.answers.name?.split(" ")[0];
      if (state.quotedAt && q && first) {
        await say(null, [`Welcome back, ${first}. Your ${formatQuote(q)} price is still held for you.`], "quote");
      } else if (first) {
        await say(null, [`Welcome back, ${first}. Let's finish your quote. You're almost there.`], state.step);
      }
    }
    return;
  }

  set({ started: true });
  track("quote_view", { preset });
  const svc = serviceOf(preset);
  if (svc) {
    set((s) => ({ answers: { ...s.answers, service: svc.slug } }));
    await say(
      null,
      [
        `Get your real ${svc.shortName.toLowerCase()} price in 60 seconds. No calls, no waiting.`,
        "A few quick taps and you'll see your exact price and the next open time.",
        "First, who am I building this quote for?",
      ],
      "contact",
    );
  } else {
    await say(
      null,
      [
        "Get your real price in 60 seconds. No calls, no waiting.",
        "A few quick taps and you'll see your exact price and the next open time. Backed by our 24-hour make-it-right promise.",
        "What do you need cleaned?",
      ],
      "service",
    );
  }
}

async function resumeFromToken(token: string) {
  try {
    const res = await fetch("/api/quote/resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const json = (await res.json()) as { ok?: boolean; data?: Answers & { service: ServiceSlug; name: string; phone: string } };
    if (!json.ok || !json.data) return false;
    const a = json.data;
    if (!currentQuote(a)) return false;
    state = { ...fresh(), started: true, answers: a, leadAt: Date.now(), quotedAt: Date.now(), lead: leadPayload(a, true) };
    track("quote_resumed", { service: a.service });
    await say(
      null,
      [`Welcome back, ${a.name.split(" ")[0]}. Here's your price.`, card("quote"), closeLine()],
      "quote",
    );
    armIdle();
    return true;
  } catch {
    return false;
  }
}

/* ─── Lead events + VA alert ─────────────────────────────────── */

/** The lead record. Details and price are only attached once they've seen their quote. */
function leadPayload(a: Answers, withQuote: boolean) {
  const q = withQuote ? currentQuote(a) : null;
  return {
    source: "quote-agent",
    page: window.location.pathname,
    name: a.name,
    phone: a.phone,
    email: a.email,
    zip: a.zip,
    service: q?.serviceName ?? serviceOf(a.service)?.name,
    frequency: a.frequency,
    quote: withQuote && {
      service: a.service,
      bedrooms: a.bedrooms,
      bathrooms: a.bathrooms,
      sqft: a.sqft,
      condition: a.condition,
      addOns: a.addOns,
      frequency: a.frequency,
      sizeTier: a.sizeTier,
    },
  };
}

async function postLead(payload: Record<string, unknown>) {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
    return res.ok && json.ok ? { ok: true as const } : { ok: false as const, error: json.error };
  } catch {
    return { ok: false as const, error: "We couldn't reach the server." };
  }
}

/** Left before booking (mid-quote or after the price) → "CALL NOW" to the VA. Fires once, survives page close. */
export function sendAbandoned() {
  if (!state.lead || state.booked || state.alerted) return;
  set({ alerted: true });
  track("quote_abandoned", { service: state.answers.service, reached: state.quotedAt ? "price" : state.step });
  const body = JSON.stringify({ ...state.lead, stage: "abandoned" });
  const sent = navigator.sendBeacon?.("/api/lead", new Blob([body], { type: "application/json" }));
  if (!sent) void fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
}

/** Any interaction restarts the idle clock. */
export function armIdle() {
  if (!state.lead || state.booked || state.alerted) return;
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(sendAbandoned, booking.abandonAfterMs);
}

/* ─── Actions ────────────────────────────────────────────────── */

const firstName = () => state.answers.name?.split(" ")[0] ?? "";

/** Assumptive close: offer the next open slot as if they're already booking. */
function closeLine() {
  const n = nextAvailable();
  const who = firstName();
  return state.answers.service === "commercial-cleaning"
    ? `${who ? `${who}, the` : "The"} next open walkthrough is ${n.label}, ${n.window}. Want me to grab it for you?`
    : `${who ? `${who}, your` : "Your"} next open time is ${n.label}, ${n.window}. Want me to grab it for you?`;
}

async function book(date: string, win: string, userText: string): Promise<string | null> {
  if (!state.lead) return "Please get your quote first.";
  const res = await postLead({ ...state.lead, stage: "booked", booking: { date, window: win } });
  if (!res.ok) return res.error ?? "Couldn't book that. Please call or text us.";
  if (idleTimer) clearTimeout(idleTimer);
  set((s) => ({ booked: true, answers: { ...s.answers, date, window: win } }));
  track("quote_booked", { service: state.answers.service, date, window: win });
  await say(
    userText,
    [
      card("booked"),
      `You're booked, ${firstName()}. We just sent a confirmation link to ${state.answers.email}.`,
      `Last step: add a card to lock in your cleaner. ${offer.payment}`,
    ],
    "card",
  );
  return null;
}

export const actions = {
  /** Step 1: a zero-risk tap. */
  chooseService(slug: ServiceSlug) {
    const svc = serviceOf(slug)!;
    set((s) => ({ answers: { ...s.answers, service: slug } }));
    stepEvent("service");
    void say(
      svc.name,
      ["Great choice. Who am I building this quote for?", "I'll save it and text you a copy, so it's there whenever you need it."],
      "contact",
    );
  },

  /** Step 2: the lead is captured here, before any details. */
  async submitContact(f: { name: string; phone: string; email: string }): Promise<string | null> {
    const digits = f.phone.replace(/\D/g, "");
    if (!f.name.trim()) return "What's your first name?";
    if (digits.length < 10) return "Enter a 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return "Enter your email so we can send your quote.";

    const answers = { ...state.answers, name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim() };
    const lead = leadPayload(answers, false);
    const res = await postLead({ ...lead, stage: "started" });
    if (!res.ok) return res.error ?? "Something went wrong. Please try again.";

    set({ answers, lead, leadAt: Date.now(), alerted: false, booked: false, cardAdded: false });
    track("quote_lead_captured", { service: answers.service });
    armIdle();

    const first = answers.name.split(" ")[0];
    if (answers.service === "commercial-cleaning") {
      await say(`${first} · ${answers.phone}`, [`Nice to meet you, ${first}. How big is the space?`], "size");
    } else {
      await say(
        `${first} · ${answers.phone}`,
        [`Nice to meet you, ${first}. Let's build your quote. How many bedrooms and bathrooms?`],
        "rooms",
      );
    }
    return null;
  },

  chooseSize(tier: string) {
    armIdle();
    set((s) => ({ answers: { ...s.answers, sizeTier: tier } }));
    stepEvent("size");
    void say(tier, ["Last one: your zip code, so I can check your next open walkthrough."], "zip");
  },

  chooseRooms(bedrooms: number, bathrooms: number) {
    armIdle();
    set((s) => ({ answers: { ...s.answers, bedrooms, bathrooms } }));
    stepEvent("rooms");
    const beds = bedrooms === 0 ? "Studio" : `${bedrooms === 5 ? "5+" : bedrooms} bed`;
    const baths = `${bathrooms === 4 ? "4+" : bathrooms} bath`;
    void say(`${beds} · ${baths}`, ["Perfect. Roughly how many square feet? A best guess is fine."], "sqft");
  },

  chooseSqft(label: string) {
    armIdle();
    set((s) => ({ answers: { ...s.answers, sqft: label } }));
    stepEvent("sqft");
    void say(
      `${label} sq ft`,
      [
        `${firstName()}, be honest, no judgment: how's it looking right now? It keeps your price exact, so there are no surprises on the day.`,
      ],
      "condition",
    );
  },

  chooseCondition(id: string) {
    armIdle();
    const c = pricing.conditions.find((x) => x.id === id)!;
    set((s) => ({ answers: { ...s.answers, condition: id } }));
    stepEvent("condition");
    const reassure = id === "heavy" || id === "overdue" ? "No problem at all. That's exactly what we're here for." : "Good to know.";
    if (state.answers.service === "maintenance-cleaning") {
      void say(c.label, [`${reassure} How often should we come? Plans save you money on every single visit.`], "freq");
    } else {
      void say(c.label, [`${reassure} Almost done. Want any extras while we're there? Tap any that apply.`], "addons");
    }
  },

  chooseFreq(label: string) {
    armIdle();
    const f = pricing.frequencies.find((x) => x.label === label);
    set((s) => ({ answers: { ...s.answers, frequency: label } }));
    stepEvent("freq");
    const nod =
      f && f.discount > 0 ? `Smart move. That saves you ${Math.round(f.discount * 100)}% on every visit.` : "Got it, one-time it is.";
    void say(label, [`${nod} Almost done. Want any extras while we're there? Tap any that apply.`], "addons");
  },

  chooseAddOns(ids: string[]) {
    armIdle();
    set((s) => ({ answers: { ...s.answers, addOns: ids } }));
    stepEvent("addons");
    const names = pricing.addOns.filter((a) => ids.includes(a.id)).map((a) => a.label);
    void say(names.length ? names.join(", ") : "No extras", ["Last one: your zip code, so I can check your next open time."], "zip");
  },

  /** Final question, then the full itemized price (never hidden) and an assumptive close. */
  async submitZip(zip: string): Promise<string | null> {
    if (!/^\d{5}$/.test(zip)) return "Enter a 5-digit zip code.";
    const answers = { ...state.answers, zip };
    const q = currentQuote(answers);
    if (!q) return "Something went wrong. Please call or text us.";

    const lead = leadPayload(answers, true);
    const res = await postLead({ ...lead, stage: "quoted" });
    if (!res.ok) return res.error ?? "Something went wrong. Please try again.";

    set({ answers, lead, quotedAt: Date.now() });
    track("quote_shown", { service: q.service, price: q.low, unit: q.unit });
    armIdle();

    await say(
      zip,
      [
        inServiceArea(zip)
          ? `Good news: we clean in ${zip}. Here's your exact price.`
          : `${zip} is just outside our usual area, but we'll confirm personally. Here's your price.`,
        card("quote"),
        card("review"),
        closeLine(),
      ],
      "quote",
    );
    return null;
  },

  bookNextAvailable(): Promise<string | null> {
    armIdle();
    const n = nextAvailable();
    return book(n.iso, n.window, "Yes, book it");
  },

  seeOtherTimes() {
    armIdle();
    track("quote_other_times");
    void say("See other times", ["No problem. Pick the day that works best."], "date");
  },

  chooseDate(iso: string, label: string) {
    armIdle();
    set((s) => ({ answers: { ...s.answers, date: iso } }));
    void say(label, ["What arrival window works best?"], "time");
  },

  chooseWindow(w: string): Promise<string | null> {
    const date = state.answers.date!;
    return book(date, w, `${dayLabel(date)}, ${w}`);
  },

  /**
   * DEMO: no card data leaves the browser. The live version uses Stripe's
   * hosted card element and saves a payment method to charge after the job.
   */
  async addCard(): Promise<string | null> {
    const { date, window: win } = state.answers;
    if (!state.lead || !date || !win) return "Book a time first.";
    const res = await postLead({ ...state.lead, stage: "card_added", booking: { date, window: win }, cardOnFile: "demo" });
    if (!res.ok) return res.error ?? "Couldn't save that. Please call or text us.";
    set({ cardAdded: true });
    track("quote_card_added", { service: state.answers.service });
    await say(
      "Card added",
      [
        `You're locked in for ${dayLabel(date)}, ${win}. Your cleaner is being scheduled now.`,
        `Nothing is charged today. ${offer.payment} See you soon, ${firstName()}.`,
      ],
      "done",
    );
    return null;
  },

  skipCard() {
    track("quote_card_skipped");
    void say(
      "I'll add it from the email",
      [`No problem. Use the link we sent to ${state.answers.email} to add your card and lock in your cleaner.`],
      "done",
    );
  },

  restart() {
    if (state.lead && !state.booked) sendAbandoned();
    if (idleTimer) clearTimeout(idleTimer);
    state = { ...fresh(), started: true };
    persist();
    listeners.forEach((l) => l());
    void say(null, ["Fresh start. What do you need cleaned?"], "service");
  },
};
