"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { business, type ServiceSlug } from "@/content/business";
import { booking, pricing } from "@/content/pricing";
import { Icon } from "@/components/ui/Icon";
import { estimate, formatQuote, inServiceArea, type Quote } from "@/lib/quote";

/* ─── Types ─────────────────────────────────────────────────── */

type Step = "service" | "size" | "beds" | "baths" | "freq" | "zip" | "contact" | "quote" | "date" | "time" | "confirm" | "done";

type Msg =
  | { id: number; from: "bot" | "user"; text: string }
  | { id: number; from: "bot"; quote: Quote; summary: string; name: string };

interface Answers {
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

const PROGRESS: Record<Step, number> = {
  service: 8, size: 30, beds: 25, baths: 40, freq: 55, zip: 68, contact: 82,
  quote: 100, date: 100, time: 100, confirm: 100, done: 100,
};

const BEDROOMS = [
  { label: "Studio", value: 0 }, { label: "1", value: 1 }, { label: "2", value: 2 },
  { label: "3", value: 3 }, { label: "4", value: 4 }, { label: "5+", value: 5 },
];
const BATHROOMS = [
  { label: "1", value: 1 }, { label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4+", value: 4 },
];

/** Opening lines use ids 1–2; everything after comes from a per-instance counter starting at 10. */
function openingLines(preset?: ServiceSlug): Msg[] {
  const svc = serviceOf(preset);
  if (!svc) {
    return [
      { id: 1, from: "bot", text: "Get your price in 30 seconds. No phone tag. No waiting." },
      { id: 2, from: "bot", text: "What do you need cleaned?" },
    ];
  }
  return [
    { id: 1, from: "bot", text: `Get your ${svc.shortName.toLowerCase()} price in 30 seconds. No phone tag. No waiting.` },
    { id: 2, from: "bot", text: preset === "commercial-cleaning" ? "How big is the space?" : "How many bedrooms?" },
  ];
}

const slugFromName = (name?: string) => business.services.find((s) => s.name === name)?.slug;
const serviceOf = (slug?: ServiceSlug) => business.services.find((s) => s.slug === slug);

function bookableDays() {
  const days: { iso: string; label: string; short: string }[] = [];
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + booking.leadDays);
  while (days.length < booking.daysAhead) {
    if (!booking.closedWeekdays.includes(d.getDay())) {
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      days.push({
        iso,
        label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
        short: d.toLocaleDateString("en-US", { weekday: "short" }),
      });
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

/* ─── Component ─────────────────────────────────────────────── */

export function QuoteAgent({ defaultService = "", className = "" }: { defaultService?: string; className?: string }) {
  const preset = slugFromName(defaultService);
  const [messages, setMessages] = useState<Msg[]>(() => openingLines(preset));
  const [step, setStep] = useState<Step>(preset ? (preset === "commercial-cleaning" ? "size" : "beds") : "service");
  const [typing, setTyping] = useState(false);
  const [answers, setAnswers] = useState<Answers>({ service: preset });
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [quote, setQuote] = useState<Quote | null>(null);

  const idRef = useRef(10);
  const nextId = () => ++idRef.current;
  const scrollRef = useRef<HTMLDivElement>(null);
  const quotedRef = useRef(false);
  const bookedRef = useRef(false);
  const alertedRef = useRef(false);
  const leadRef = useRef<Record<string, unknown> | null>(null);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [days] = useState(bookableDays);

  // Follow the conversation, but when the price lands, frame the price card itself.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const card = step === "quote" ? el.querySelector<HTMLElement>("[data-quote-card]") : null;
    el.scrollTo({ top: card ? card.offsetTop - 12 : el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, step]);

  /** User bubble now, bot reply after a short "typing" beat, then advance. */
  const reply = useCallback((userText: string | null, botTexts: string[], next: Step) => {
    if (userText) setMessages((m) => [...m, { id: nextId(), from: "user", text: userText }]);
    setError(null);
    setTyping(true); // inputs stay hidden until the bot "finishes typing"
    setStep(next);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, ...botTexts.map((text) => ({ id: nextId(), from: "bot" as const, text }))]);
    }, 520);
  }, []);

  /* ─── Lead events ─── */

  const post = useCallback(async (payload: Record<string, unknown>) => {
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: window.location.pathname, ...payload }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      return res.ok && json.ok ? { ok: true as const } : { ok: false as const, error: json.error };
    } catch {
      return { ok: false as const, error: "We couldn't reach the server." };
    }
  }, []);

  /** Quoted but not booked → tell the VA to call. Fires once, survives page close. */
  const sendAbandoned = useCallback(() => {
    if (!quotedRef.current || bookedRef.current || alertedRef.current || !leadRef.current) return;
    alertedRef.current = true;
    const body = JSON.stringify({ ...leadRef.current, stage: "abandoned" });
    const sent = navigator.sendBeacon?.("/api/lead", new Blob([body], { type: "application/json" }));
    if (!sent) void fetch("/api/lead", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true });
  }, []);

  const armIdleTimer = useCallback(() => {
    if (!quotedRef.current || bookedRef.current || alertedRef.current) return;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(sendAbandoned, booking.abandonAfterMs);
  }, [sendAbandoned]);

  useEffect(() => {
    window.addEventListener("pagehide", sendAbandoned);
    return () => {
      window.removeEventListener("pagehide", sendAbandoned);
      if (idleTimer.current) clearTimeout(idleTimer.current);
      sendAbandoned(); // navigated elsewhere in the site without booking
    };
  }, [sendAbandoned]);

  /* ─── Step handlers ─── */

  const chooseService = (slug: ServiceSlug) => {
    const svc = serviceOf(slug)!;
    setAnswers((a) => ({ ...a, service: slug }));
    if (slug === "commercial-cleaning") reply(svc.name, ["Got it. How big is the space?"], "size");
    else reply(svc.name, ["Got it. How many bedrooms?"], "beds");
  };

  const chooseSize = (tier: string) => {
    setAnswers((a) => ({ ...a, sizeTier: tier }));
    reply(tier, ["What's your zip code? Just making sure we cover you."], "zip");
  };

  const chooseBeds = (b: (typeof BEDROOMS)[number]) => {
    setAnswers((a) => ({ ...a, bedrooms: b.value }));
    reply(b.value === 0 ? "Studio" : `${b.label} bedroom${b.value === 1 ? "" : "s"}`, ["And bathrooms?"], "baths");
  };

  const chooseBaths = (b: (typeof BATHROOMS)[number]) => {
    setAnswers((a) => ({ ...a, bathrooms: b.value }));
    if (answers.service === "maintenance-cleaning") {
      reply(`${b.label} bathroom${b.value === 1 ? "" : "s"}`, ["How often? The more often we come, the less you pay per visit."], "freq");
    } else {
      reply(`${b.label} bathroom${b.value === 1 ? "" : "s"}`, ["What's your zip code? Just making sure we cover you."], "zip");
    }
  };

  const chooseFreq = (label: string) => {
    setAnswers((a) => ({ ...a, frequency: label }));
    reply(label, ["What's your zip code? Just making sure we cover you."], "zip");
  };

  const submitZip = (zip: string) => {
    if (!/^\d{5}$/.test(zip)) {
      setError("Enter a 5-digit zip code.");
      return;
    }
    setAnswers((a) => ({ ...a, zip }));
    reply(
      zip,
      [
        inServiceArea(zip)
          ? "You're in our area. Your price is ready. Where should we text it?"
          : "You might be just outside our usual area. We'll confirm personally. Where should we text your price?",
      ],
      "contact",
    );
  };

  const submitContact = async (name: string, phone: string) => {
    const digits = phone.replace(/\D/g, "");
    if (!name.trim()) return setError("What's your first name?");
    if (digits.length < 10) return setError("Enter a 10-digit phone number so we can text your quote.");

    const q = estimate({
      service: answers.service!,
      bedrooms: answers.bedrooms,
      bathrooms: answers.bathrooms,
      frequency: answers.frequency,
      sizeTier: answers.sizeTier,
    });
    if (!q) return setError("Something went wrong. Please call or text us.");

    const first = name.trim().split(" ")[0];
    const next = { ...answers, name: name.trim(), phone };
    setAnswers(next);

    const lead = {
      source: "quote-agent",
      page: window.location.pathname,
      name: next.name,
      phone,
      zip: next.zip,
      service: q.serviceName,
      frequency: next.frequency,
      quote: {
        service: next.service,
        bedrooms: next.bedrooms,
        bathrooms: next.bathrooms,
        frequency: next.frequency,
        sizeTier: next.sizeTier,
      },
    };

    setSending(true);
    const res = await post({ ...lead, stage: "quoted" });
    setSending(false);
    if (!res.ok) return setError(res.error ?? "Something went wrong. Please try again.");

    leadRef.current = lead;
    quotedRef.current = true;
    setQuote(q);
    armIdleTimer();

    const parts =
      q.service === "commercial-cleaning"
        ? [next.sizeTier]
        : [
            next.bedrooms === 0 ? "Studio" : `${next.bedrooms} bed`,
            `${next.bathrooms} bath`,
            next.frequency,
          ];

    setMessages((m) => [...m, { id: nextId(), from: "user", text: `${first} · ${phone}` }]);
    setTyping(true);
    setStep("quote");
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: nextId(), from: "bot", quote: q, summary: parts.filter(Boolean).join(" · "), name: first },
        {
          id: nextId(),
          from: "bot",
          text:
            q.service === "commercial-cleaning"
              ? "Final price comes after a quick walkthrough. Grab a time and we'll come to you."
              : "Want it? Pick a day and you're done. Takes 10 seconds.",
        },
      ]);
    }, 700);
  };

  const startBooking = () => {
    armIdleTimer();
    reply("Book my clean", ["Pick a day."], "date");
  };

  const chooseDate = (d: (typeof days)[number]) => {
    armIdleTimer();
    setAnswers((a) => ({ ...a, date: d.iso }));
    reply(d.label, ["What arrival window works best?"], "time");
  };

  const chooseWindow = (w: string) => {
    armIdleTimer();
    const day = days.find((d) => d.iso === answers.date);
    setAnswers((a) => ({ ...a, window: w }));
    reply(w, [`${day?.label}, ${w}. Lock it in?`], "confirm");
  };

  const confirmBooking = async () => {
    if (!leadRef.current || !answers.date || !answers.window) return;
    setSending(true);
    const res = await post({ ...leadRef.current, stage: "booked", booking: { date: answers.date, window: answers.window } });
    setSending(false);
    if (!res.ok) return setError(res.error ?? "Couldn't book that. Please call or text us.");
    bookedRef.current = true;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    const day = days.find((d) => d.iso === answers.date);
    reply(
      "Lock it in",
      [
        `Done, ${answers.name?.split(" ")[0]}. You're requested for ${day?.label}, ${answers.window}.`,
        `We'll text ${answers.phone} to confirm your spot. Questions before then? Call or text ${business.contact.phoneDisplay}.`,
      ],
      "done",
    );
  };

  const restart = () => {
    if (quotedRef.current && !bookedRef.current) sendAbandoned();
    quotedRef.current = bookedRef.current = alertedRef.current = false;
    leadRef.current = null;
    if (idleTimer.current) clearTimeout(idleTimer.current);
    setQuote(null);
    setAnswers({});
    setError(null);
    setMessages([
      { id: nextId(), from: "bot", text: "Fresh start. What do you need cleaned?" },
    ]);
    setStep("service");
  };

  /* ─── Render ─── */

  const svc = serviceOf(answers.service);

  return (
    <div
      onPointerDown={armIdleTimer}
      onKeyDown={armIdleTimer}
      className={`flex flex-col overflow-hidden rounded-2xl bg-white text-ink shadow-[0_30px_70px_-30px_rgba(8,18,38,0.55)] ${className}`}
    >
      {/* Header */}
      <div className="border-b border-sand px-5 pb-4 pt-5 md:px-6">
        <div className="flex items-center gap-3">
          <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink">
            <Image src="/brand/mark.png" alt="" width={300} height={338} className="h-6 w-auto" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#22c55e]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="display text-[1.25rem] leading-tight md:text-[1.375rem]">Get Your Instant Quote</h2>
            <p className="text-[0.8125rem] text-stone">Quote assistant · Answers in seconds</p>
          </div>
          {pricing.placeholder && (
            <span
              title="Prices come from content/pricing.ts and are placeholders until real rates are set."
              className="rounded-md bg-[#fff4e5] px-2 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-[#9a5b00]"
            >
              Sample pricing
            </span>
          )}
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-linen" aria-hidden="true">
          <div
            className="h-full rounded-full bg-hub transition-[width] duration-500 ease-[var(--ease-out-expo)]"
            style={{ width: `${PROGRESS[step]}%` }}
          />
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        aria-live="polite"
        className="relative h-[16rem] space-y-2.5 overflow-y-auto overscroll-contain px-5 py-4 [scrollbar-width:thin] md:h-[17rem] md:px-6"
      >
        {messages.map((m) =>
          "quote" in m ? (
            <QuoteCard key={m.id} quote={m.quote} summary={m.summary} name={m.name} />
          ) : m.from === "bot" ? (
            <p key={m.id} className="agent-in max-w-[88%] rounded-2xl rounded-tl-md bg-linen px-4 py-2.5 text-[0.9375rem] leading-snug">
              {m.text}
            </p>
          ) : (
            <p key={m.id} className="agent-in ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-md bg-hub px-4 py-2.5 text-[0.9375rem] font-semibold leading-snug text-white">
              {m.text}
            </p>
          ),
        )}
        {typing && (
          <span className="flex w-fit gap-1 rounded-2xl rounded-tl-md bg-linen px-4 py-3.5" aria-label="Assistant is typing">
            {[0, 1, 2].map((i) => (
              <span key={i} className="agent-dot h-1.5 w-1.5 rounded-full bg-stone/60" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
        )}
      </div>

      {/* Input area: one decision at a time */}
      <div className="border-t border-sand bg-porcelain/60 px-5 pb-5 pt-4 md:px-6">
        {!typing && (
          <div className="agent-in">
            {step === "service" && (
              <Chips>
                {business.services.map((s) => (
                  <Chip key={s.slug} onClick={() => chooseService(s.slug)}>
                    {s.shortName}
                  </Chip>
                ))}
              </Chips>
            )}

            {step === "size" && (
              <Chips>
                {pricing.commercial.map((t) => (
                  <Chip key={t.label} onClick={() => chooseSize(t.label)}>
                    {t.label}
                  </Chip>
                ))}
              </Chips>
            )}

            {step === "beds" && (
              <Chips cols={6}>
                {BEDROOMS.map((b) => (
                  <Chip key={b.label} onClick={() => chooseBeds(b)}>
                    {b.label}
                  </Chip>
                ))}
              </Chips>
            )}

            {step === "baths" && (
              <Chips cols={4}>
                {BATHROOMS.map((b) => (
                  <Chip key={b.label} onClick={() => chooseBaths(b)}>
                    {b.label}
                  </Chip>
                ))}
              </Chips>
            )}

            {step === "freq" && (
              <Chips cols={3}>
                {pricing.frequencies.map((f) => (
                  <Chip key={f.label} onClick={() => chooseFreq(f.label)}>
                    <span className="block">{f.label}</span>
                    {f.discount > 0 && <span className="block text-[0.6875rem] font-bold text-hub">Save {Math.round(f.discount * 100)}%</span>}
                  </Chip>
                ))}
              </Chips>
            )}

            {step === "zip" && <ZipInput onSubmit={submitZip} />}

            {step === "contact" && <ContactInput sending={sending} onSubmit={submitContact} />}

            {step === "quote" && quote && (
              <div className="grid gap-2.5">
                <button type="button" onClick={startBooking} className="btn btn-primary !h-13 w-full !text-base">
                  {quote.service === "commercial-cleaning" ? "Book my walkthrough" : "Book my clean"}
                  <Icon name="arrow" size={18} className="btn-arrow" />
                </button>
                <div className="flex items-center justify-between text-[0.8125rem]">
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event("scrubhub:chat"))}
                    className="font-bold text-hub hover:underline"
                  >
                    I have a question
                  </button>
                  <a href={business.contact.phoneHref} className="font-bold text-ink hover:underline">
                    Call {business.contact.phoneDisplay}
                  </a>
                </div>
              </div>
            )}

            {step === "date" && (
              <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1" data-lenis-prevent>
                {days.map((d) => (
                  <button
                    key={d.iso}
                    type="button"
                    onClick={() => chooseDate(d)}
                    className="snap-start rounded-xl border-[1.5px] border-sand bg-white px-3.5 py-2.5 text-center transition-colors hover:border-hub hover:text-hub"
                  >
                    <span className="block text-[0.6875rem] font-bold uppercase tracking-wide text-stone">{d.short}</span>
                    <span className="block whitespace-nowrap text-[0.9375rem] font-bold">{d.label.replace(/^\w+, /, "")}</span>
                  </button>
                ))}
              </div>
            )}

            {step === "time" && (
              <Chips cols={2}>
                {booking.windows.map((w) => (
                  <Chip key={w} onClick={() => chooseWindow(w)}>
                    {w}
                  </Chip>
                ))}
              </Chips>
            )}

            {step === "confirm" && (
              <div className="grid gap-2.5">
                <button type="button" disabled={sending} onClick={confirmBooking} className="btn btn-primary !h-13 w-full !text-base">
                  {sending ? "Booking…" : "Lock it in"} <Icon name="check" size={18} strokeWidth={2.2} />
                </button>
                <button type="button" onClick={() => setStep("date")} className="text-[0.8125rem] font-bold text-stone hover:text-ink">
                  Pick a different time
                </button>
              </div>
            )}

            {step === "done" && (
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[0.875rem] font-bold text-[#15803d]">
                  <Icon name="check" size={17} strokeWidth={2.4} /> Booking requested
                </span>
                <a href={business.contact.smsHref} className="btn btn-ghost !h-10 !px-4 !text-[0.8125rem]">
                  <Icon name="message" size={15} /> Text us
                </a>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-2.5 text-[0.8125rem] font-semibold text-[#b42318]">
                {error}
              </p>
            )}

            {(step === "service" || step === "beds" || step === "size") && (
              <p className="mt-3 text-center text-[0.75rem] text-stone">
                Rather talk?{" "}
                <a href={business.contact.phoneHref} className="font-bold text-ink hover:underline">
                  Call or text {business.contact.phoneDisplay}
                </a>
              </p>
            )}
            {svc && step !== "service" && step !== "done" && !quote && (
              <button type="button" onClick={restart} className="mt-2 block w-full text-center text-[0.75rem] text-stone hover:text-ink">
                Start over
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Pieces ────────────────────────────────────────────────── */

function Chips({ children, cols }: { children: React.ReactNode; cols?: number }) {
  const grid = cols ? { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 6: "grid-cols-3 sm:grid-cols-6" }[cols] : "";
  return <div className={cols ? `grid gap-2 ${grid}` : "flex flex-wrap gap-2"}>{children}</div>;
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="min-h-11 rounded-xl border-[1.5px] border-sand bg-white px-4 py-2 text-[0.9375rem] font-bold text-ink transition-all duration-200 hover:-translate-y-px hover:border-hub hover:text-hub active:translate-y-0"
    >
      {children}
    </button>
  );
}

function ZipInput({ onSubmit }: { onSubmit: (zip: string) => void }) {
  const [zip, setZip] = useState("");
  return (
    <form
      className="flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(zip.trim());
      }}
    >
      <label htmlFor="agent-zip" className="sr-only">Zip code</label>
      <input
        id="agent-zip"
        autoFocus
        inputMode="numeric"
        autoComplete="postal-code"
        maxLength={5}
        value={zip}
        onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
        placeholder="Zip code"
        className="field !h-12 flex-1"
      />
      <button type="submit" className="btn btn-primary !h-12 !px-5">
        Next <Icon name="arrow" size={16} />
      </button>
    </form>
  );
}

function ContactInput({ onSubmit, sending }: { onSubmit: (name: string, phone: string) => void; sending: boolean }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  return (
    <form
      className="grid gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(name, phone);
      }}
    >
      <div className="grid grid-cols-[1fr_1.2fr] gap-2">
        <label htmlFor="agent-name" className="sr-only">First name</label>
        <input
          id="agent-name"
          autoFocus
          autoComplete="given-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name"
          className="field !h-12"
        />
        <label htmlFor="agent-phone" className="sr-only">Mobile number</label>
        <input
          id="agent-phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Mobile number"
          className="field !h-12"
        />
      </div>
      <button type="submit" disabled={sending} className="btn btn-primary !h-12 w-full">
        {sending ? "Pricing…" : "Show my price"} <Icon name="arrow" size={16} className="btn-arrow" />
      </button>
      <p className="text-center text-[0.6875rem] text-stone">So we can text you your quote and booking details.</p>
    </form>
  );
}

function QuoteCard({ quote, summary, name }: { quote: Quote; summary: string; name: string }) {
  const svc = business.services.find((s) => s.slug === quote.service)!;
  const perks = [svc.focus[0], svc.focus[1], `${business.guarantee.hours}-hour make-it-right promise`];
  return (
    <div data-quote-card className="agent-in on-ink overflow-hidden rounded-2xl bg-ink text-white">
      <div className="px-4 pb-3 pt-4">
        <p className="text-[0.8125rem] text-mist">{name}, here&rsquo;s your price:</p>
        <p className="display mt-1 text-[2rem] leading-none">
          {formatQuote(quote)}
          <span className="ml-1.5 align-middle text-[0.8125rem] font-semibold text-mist">{quote.unit}</span>
        </p>
        <p className="mt-2 text-[0.75rem] text-mist">
          {svc.name}
          {summary && ` · ${summary}`}
        </p>
        {quote.discountLabel && (
          <span className="mt-2 inline-block rounded-md bg-glint/15 px-2 py-0.5 text-[0.6875rem] font-bold text-glint">
            {quote.discountLabel}
          </span>
        )}
      </div>
      <ul className="space-y-1.5 border-t border-white/10 px-4 py-3 text-[0.8125rem]">
        {perks.map((p) => (
          <li key={p} className="flex gap-2">
            <Icon name="check" size={14} strokeWidth={2.4} className="mt-0.5 shrink-0 text-glint" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
