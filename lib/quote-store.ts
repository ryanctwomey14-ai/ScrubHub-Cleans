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
 * Flow (home services):
 *   service → bedrooms + bathrooms → square feet → condition → [frequency]
 *   → add-ons → contact (name, mobile, email, zip) → exact price + next open
 *   slot → booked → card to lock in the cleaner (demo) → done
 */

export type Step =
  | "service" | "size" | "rooms" | "sqft" | "condition" | "freq" | "addons" | "contact"
  | "quote" | "date" | "time" | "card" | "done";

export type Msg =
  | { id: number; from: "bot" | "user"; text: string }
  | { id: number; from: "bot"; card: "preview" | "quote" | "review" | "booked" };

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
  if (a.service === "commercial-cleaning") return ["service", "size", "contact"];
  if (a.service === "maintenance-cleaning") return ["service", "rooms", "sqft", "condition", "freq", "addons", "contact"];
  return ["service", "rooms", "sqft", "condition", "addons", "contact"];
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

const card = (c: "preview" | "quote" | "review" | "booked"): Msg => ({ id: 0, from: "bot", card: c });

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
    if (state.quotedAt && !state.booked && !sessionStorage.getItem("scrubhub-welcomed")) {
      sessionStorage.setItem("scrubhub-welcomed", "1");
      const q = currentQuote(state.answers);
      const first = state.answers.name?.split(" ")[0];
      if (q && first) {
        await say(null, [`Welcome back, ${first}. Your ${formatQuote(q)} price is still held for you.`], "quote");
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
        "A few quick taps and I'll show your exact price and the next open time.",
        svc.slug === "commercial-cleaning" ? "How big is the space?" : "How many bedrooms and bathrooms?",
      ],
      svc.slug === "commercial-cleaning" ? "size" : "rooms",
    );
  } else {
    await say(
      null,
      [
        "Get your real price in 60 seconds. No calls, no waiting.",
        "A few quick taps and I'll show your exact price and the next open time. Backed by our 24-hour make-it-right promise.",
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
    state = { ...fresh(), started: true, answers: a, quotedAt: Date.now(), lead: leadPayload(a) };
    track("quote_resumed", { service: a.service });
    await say(
      null,
      [`Welcome back, ${a.name.split(" ")[0]}. Here's your price.`, card("quote"), "Your next open time is below. One tap and it's yours."],
      "quote",
    );
    armIdle();
    return true;
  } catch {
    return false;
  }
}

/* ─── Lead events + VA alert ─────────────────────────────────── */

function leadPayload(a: Answers) {
  const q = currentQuote(a);
  return {
    source: "quote-agent",
    page: window.location.pathname,
    name: a.name,
    phone: a.phone,
    email: a.email,
    zip: a.zip,
    service: q?.serviceName,
    frequency: a.frequency,
    quote: {
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

/** Quoted but not booked → "CALL NOW" to the VA. Fires once, survives page close. */
export function sendAbandoned() {
  if (!state.quotedAt || state.booked || state.alerted || !state.lead) return;
  set({ alerted: true });
  track("quote_abandoned", { service: state.answers.service });
  const body = JSON.stringify({ ...state.lead, stage: "abandoned" });
  const sent = navigator.sendBeacon?.("/api/lead", new Blob([body], { type: "application/json" }));
  if (!sent) void fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
}

/** Any interaction restarts the idle clock. */
export function armIdle() {
  if (!state.quotedAt || state.booked || state.alerted) return;
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(sendAbandoned, booking.abandonAfterMs);
}

/* ─── Actions ────────────────────────────────────────────────── */

const toSqft = "About how many square feet? Your best guess is fine.";
const toAddOns = "Want any extras? Tap everything you'd like, or skip.";

async function book(date: string, win: string, userText: string): Promise<string | null> {
  if (!state.lead) return "Please get your quote first.";
  const res = await postLead({ ...state.lead, stage: "booked", booking: { date, window: win } });
  if (!res.ok) return res.error ?? "Couldn't book that. Please call or text us.";
  if (idleTimer) clearTimeout(idleTimer);
  set((s) => ({ booked: true, answers: { ...s.answers, date, window: win } }));
  track("quote_booked", { service: state.answers.service, date, window: win });
  const first = state.answers.name?.split(" ")[0];
  await say(
    userText,
    [
      card("booked"),
      `You're booked, ${first}. We just sent a confirmation link to ${state.answers.email}.`,
      `Last step: add a card to lock in your cleaner. ${offer.payment}`,
    ],
    "card",
  );
  return null;
}

export const actions = {
  chooseService(slug: ServiceSlug) {
    const svc = serviceOf(slug)!;
    set((s) => ({ answers: { ...s.answers, service: slug } }));
    stepEvent("service");
    if (slug === "commercial-cleaning") void say(svc.name, ["Got it. How big is the space?"], "size");
    else void say(svc.name, ["Got it. How many bedrooms and bathrooms?"], "rooms");
  },

  chooseSize(tier: string) {
    set((s) => ({ answers: { ...s.answers, sizeTier: tier } }));
    stepEvent("size");
    void say(tier, ["Your starting price is ready. Where should we send it?"], "contact");
  },

  chooseRooms(bedrooms: number, bathrooms: number) {
    set((s) => ({ answers: { ...s.answers, bedrooms, bathrooms } }));
    stepEvent("rooms");
    const beds = bedrooms === 0 ? "Studio" : `${bedrooms === 5 ? "5+" : bedrooms} bed`;
    const baths = `${bathrooms === 4 ? "4+" : bathrooms} bath`;
    void say(`${beds} · ${baths}`, [toSqft], "sqft");
  },

  chooseSqft(label: string) {
    set((s) => ({ answers: { ...s.answers, sqft: label } }));
    stepEvent("sqft");
    void say(
      `${label} sq ft`,
      ["Be honest, no judgment: how's it looking right now? This keeps your price accurate, so there are no surprises."],
      "condition",
    );
  },

  chooseCondition(id: string) {
    const c = pricing.conditions.find((x) => x.id === id)!;
    set((s) => ({ answers: { ...s.answers, condition: id } }));
    stepEvent("condition");
    if (state.answers.service === "maintenance-cleaning") {
      void say(c.label, ["How often? One-time, or a plan that saves you money on every visit?"], "freq");
    } else {
      void say(c.label, [toAddOns], "addons");
    }
  },

  chooseFreq(label: string) {
    set((s) => ({ answers: { ...s.answers, frequency: label } }));
    stepEvent("freq");
    void say(label, [toAddOns], "addons");
  },

  chooseAddOns(ids: string[]) {
    set((s) => ({ answers: { ...s.answers, addOns: ids } }));
    stepEvent("addons");
    const names = pricing.addOns.filter((a) => ids.includes(a.id)).map((a) => a.label);
    void say(
      names.length ? names.join(", ") : "No extras",
      ["Your exact price is ready.", card("preview"), "Where should we send it? We'll text and email your quote so you can book in one tap."],
      "contact",
    );
  },

  async submitContact(f: { name: string; phone: string; email: string; zip: string }): Promise<string | null> {
    const digits = f.phone.replace(/\D/g, "");
    if (!f.name.trim()) return "What's your first name?";
    if (digits.length < 10) return "Enter a 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) return "Enter your email so we can send your confirmation link.";
    if (!/^\d{5}$/.test(f.zip.trim())) return "Enter your 5-digit zip code.";

    const answers = { ...state.answers, name: f.name.trim(), phone: f.phone.trim(), email: f.email.trim(), zip: f.zip.trim() };
    const q = currentQuote(answers);
    if (!q) return "Something went wrong. Please call or text us.";

    track("quote_contact_submitted", { service: answers.service });
    const lead = leadPayload(answers);
    const res = await postLead({ ...lead, stage: "quoted" });
    if (!res.ok) return res.error ?? "Something went wrong. Please try again.";

    // The blurred preview "unlocks" into the real price.
    set((s) => ({
      answers,
      lead,
      quotedAt: Date.now(),
      alerted: false,
      booked: false,
      cardAdded: false,
      messages: s.messages.filter((m) => !("card" in m && m.card === "preview")),
    }));
    track("quote_shown", { service: q.service, price: q.low, unit: q.unit });
    armIdle();

    const coverage = inServiceArea(answers.zip) ? [] : [`${answers.zip} is just outside our usual area. We'll confirm coverage personally.`];
    await say(
      `${answers.name.split(" ")[0]} · ${answers.phone}`,
      [
        card("quote"),
        ...coverage,
        card("review"),
        q.kind === "startingAt"
          ? "Final price comes after a quick walkthrough. Your next open walkthrough time is below."
          : "Your next open time is below. One tap and it's yours.",
      ],
      "quote",
    );
    return null;
  },

  bookNextAvailable(): Promise<string | null> {
    armIdle();
    const n = nextAvailable();
    return book(n.iso, n.window, `Book ${n.label}, ${n.window}`);
  },

  seeOtherTimes() {
    armIdle();
    track("quote_other_times");
    void say("See other times", ["Pick your day."], "date");
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
        `Nothing is charged today. ${offer.payment} See you soon.`,
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
    if (state.quotedAt && !state.booked) sendAbandoned();
    if (idleTimer) clearTimeout(idleTimer);
    state = { ...fresh(), started: true };
    persist();
    listeners.forEach((l) => l());
    void say(null, ["Fresh start. What do you need cleaned?"], "service");
  },
};
