"use client";

import { business, type ServiceSlug } from "@/content/business";
import { booking, offer } from "@/content/pricing";
import { estimate, formatQuote, inServiceArea, type Quote } from "@/lib/quote";
import { track } from "@/lib/track";

/**
 * One quote conversation shared by every assistant on the site (hero, final
 * CTA, exit nudge), saved to localStorage so progress survives refreshes and
 * page changes, and resumable from the link we text the customer.
 */

export type Step =
  | "service" | "size" | "beds" | "baths" | "freq" | "zip" | "contact"
  | "quote" | "date" | "time" | "confirm" | "done";

export type Msg =
  | { id: number; from: "bot" | "user"; text: string }
  | { id: number; from: "bot"; card: "preview" | "quote" | "review" };

export interface Answers {
  service?: ServiceSlug;
  bedrooms?: number;
  bathrooms?: number;
  frequency?: string;
  sizeTier?: string;
  zip?: string;
  name?: string;
  phone?: string;
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
  alerted: boolean;
  updatedAt: number;
  /** Transient (not saved) */
  typing: boolean;
  started: boolean;
}

const KEY = "scrubhub-quote-v2";
const TTL = offer.priceLockDays * 86_400_000;

const fresh = (): QuoteState => ({
  step: "service",
  messages: [],
  answers: {},
  lead: null,
  booked: false,
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
  return estimate({ service: a.service, bedrooms: a.bedrooms, bathrooms: a.bathrooms, frequency: a.frequency, sizeTier: a.sizeTier });
}

/** Questions for this visitor's path, used for "Question 2 of 5". */
export function questionPath(a: Answers): Step[] {
  if (a.service === "commercial-cleaning") return ["service", "size", "zip", "contact"];
  if (a.service === "maintenance-cleaning") return ["service", "beds", "baths", "freq", "zip", "contact"];
  return ["service", "beds", "baths", "zip", "contact"];
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
    await wait(i === 0 ? 480 : 380);
    const line = bot[i];
    const msg: Msg = typeof line === "string" ? { id: id(), from: "bot", text: line } : { ...line, id: id() };
    set((s) => ({ messages: [...s.messages, msg], typing: i < bot.length - 1 }));
  }
  if (!bot.length) set({ typing: false });
}

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
        await say(null, [`Welcome back, ${first}. Your ${formatQuote(q)} price is still held for you.`], state.step === "done" ? "done" : "quote");
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
        `Your ${svc.shortName.toLowerCase()}, handled. Walk in to a spotless space without lifting a finger.`,
        "A few taps. Your exact price. Pick your day.",
        svc.slug === "commercial-cleaning" ? "How big is the space?" : "How many bedrooms?",
      ],
      svc.slug === "commercial-cleaning" ? "size" : "beds",
    );
  } else {
    await say(
      null,
      [
        "Walk in to a spotless home without lifting a finger.",
        "A few taps. Your exact price. Pick your day. Backed by our 24-hour make-it-right promise.",
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
    const q = currentQuote(a);
    if (!q) return false;
    state = {
      ...fresh(),
      started: true,
      answers: a,
      quotedAt: Date.now(),
      lead: leadPayload(a),
    };
    track("quote_resumed", { service: a.service });
    await say(
      null,
      [
        `Welcome back, ${a.name.split(" ")[0]}. Here's your price.`,
        { id: 0, from: "bot", card: "quote" },
        "Pick your day and you're done. Takes 10 seconds.",
      ],
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
    zip: a.zip,
    service: q?.serviceName,
    frequency: a.frequency,
    quote: { service: a.service, bedrooms: a.bedrooms, bathrooms: a.bathrooms, frequency: a.frequency, sizeTier: a.sizeTier },
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

const zipAsk = "Last one before your price: what's your zip? Just making sure we cover you.";

export const actions = {
  chooseService(slug: ServiceSlug) {
    const svc = serviceOf(slug)!;
    set((s) => ({ answers: { ...s.answers, service: slug } }));
    stepEvent("service");
    if (slug === "commercial-cleaning") void say(svc.name, ["Got it. How big is the space?"], "size");
    else void say(svc.name, ["Got it. How many bedrooms?"], "beds");
  },

  chooseSize(tier: string) {
    set((s) => ({ answers: { ...s.answers, sizeTier: tier } }));
    stepEvent("size");
    void say(tier, [zipAsk], "zip");
  },

  chooseBeds(value: number, label: string) {
    set((s) => ({ answers: { ...s.answers, bedrooms: value } }));
    stepEvent("beds");
    void say(value === 0 ? "Studio" : `${label} bedroom${value === 1 ? "" : "s"}`, ["And bathrooms?"], "baths");
  },

  chooseBaths(value: number, label: string) {
    set((s) => ({ answers: { ...s.answers, bathrooms: value } }));
    stepEvent("baths");
    const text = `${label} bathroom${value === 1 ? "" : "s"}`;
    if (state.answers.service === "maintenance-cleaning") {
      void say(text, ["How often? Recurring clients pay less for every clean."], "freq");
    } else {
      void say(text, [zipAsk], "zip");
    }
  },

  chooseFreq(label: string) {
    set((s) => ({ answers: { ...s.answers, frequency: label } }));
    stepEvent("freq");
    void say(label, [zipAsk], "zip");
  },

  submitZip(zip: string): string | null {
    if (!/^\d{5}$/.test(zip)) return "Enter a 5-digit zip code.";
    set((s) => ({ answers: { ...s.answers, zip } }));
    stepEvent("zip");
    void say(
      zip,
      [
        inServiceArea(zip) ? `Good news: we clean in ${zip}. Your exact price is ready.` : "You're just outside our usual area, but we'll confirm personally. Your price is ready.",
        { id: 0, from: "bot", card: "preview" },
        "Where should we text it? You'll be able to book from your phone in one tap.",
      ],
      "contact",
    );
    return null;
  },

  async submitContact(name: string, phone: string): Promise<string | null> {
    const digits = phone.replace(/\D/g, "");
    if (!name.trim()) return "What's your first name?";
    if (digits.length < 10) return "Enter a 10-digit mobile number so we can text your price.";

    const answers = { ...state.answers, name: name.trim(), phone };
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
      messages: s.messages.filter((m) => !("card" in m && m.card === "preview")),
    }));
    track("quote_shown", { service: q.service, price: q.low, unit: q.unit });
    armIdle();

    await say(
      `${name.trim().split(" ")[0]} · ${phone}`,
      [
        { id: 0, from: "bot", card: "quote" },
        { id: 0, from: "bot", card: "review" },
        q.kind === "startingAt"
          ? "Final price comes after a quick walkthrough. Grab a time and we'll come to you."
          : "Want it? Pick your day. Takes 10 seconds.",
      ],
      "quote",
    );
    return null;
  },

  startBooking() {
    armIdle();
    track("quote_book_started", { service: state.answers.service });
    void say(state.answers.service === "commercial-cleaning" ? "Book my walkthrough" : "Book my clean", ["Pick your day."], "date");
  },

  chooseDate(iso: string, label: string) {
    armIdle();
    set((s) => ({ answers: { ...s.answers, date: iso } }));
    void say(label, ["What arrival window works best?"], "time");
  },

  chooseWindow(w: string) {
    armIdle();
    const day = bookableDays().find((d) => d.iso === state.answers.date);
    set((s) => ({ answers: { ...s.answers, window: w } }));
    void say(w, [`${day?.label}, ${w}. Lock it in?`], "confirm");
  },

  changeTime() {
    set({ step: "date" });
  },

  async confirmBooking(): Promise<string | null> {
    const { date, window: win, name, phone } = state.answers;
    if (!state.lead || !date || !win) return "Pick a day and time first.";
    const res = await postLead({ ...state.lead, stage: "booked", booking: { date, window: win } });
    if (!res.ok) return res.error ?? "Couldn't book that. Please call or text us.";
    if (idleTimer) clearTimeout(idleTimer);
    set({ booked: true });
    track("quote_booked", { service: state.answers.service, date, window: win });
    const day = bookableDays().find((d) => d.iso === date);
    await say(
      "Lock it in",
      [
        `Done, ${name?.split(" ")[0]}. You're requested for ${day?.label}, ${win}.`,
        `We'll text ${phone} to confirm your spot. Questions before then? Call or text ${business.contact.phoneDisplay}.`,
      ],
      "done",
    );
    return null;
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
