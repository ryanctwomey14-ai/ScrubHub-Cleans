"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { business } from "@/content/business";
import { booking, offer, pricing, smsConsent } from "@/content/pricing";
import { Icon, Stars } from "@/components/ui/Icon";
import { formatQuote } from "@/lib/quote";
import {
  actions,
  armIdle,
  bookableDays,
  currentQuote,
  ensureStarted,
  questionPath,
  quoteStore,
  serviceOf,
  type Msg,
} from "@/lib/quote-store";

const BEDROOMS = [
  { label: "Studio", value: 0 }, { label: "1", value: 1 }, { label: "2", value: 2 },
  { label: "3", value: 3 }, { label: "4", value: 4 }, { label: "5+", value: 5 },
];
const BATHROOMS = [
  { label: "1", value: 1 }, { label: "2", value: 2 }, { label: "3", value: 3 }, { label: "4+", value: 4 },
];

const samplePricing = pricing.placeholder || offer.placeholder;

/**
 * Instant quote assistant, built on Hormozi's value equation:
 *   dream outcome ↑ (spotless home, no effort)  ·  perceived likelihood ↑ (4.8★, 24-hour promise)
 *   time delay ↓ (price in seconds, earliest date)  ·  effort ↓ (taps, not typing)
 * Every assistant on the site shares one saved conversation (lib/quote-store).
 */
export function QuoteAgent({ defaultService = "", className = "" }: { defaultService?: string; className?: string }) {
  const s = useSyncExternalStore(quoteStore.subscribe, quoteStore.get, quoteStore.getServer);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [allDates, setAllDates] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const preset = business.services.find((x) => x.name === defaultService)?.slug;

  useEffect(() => {
    void ensureStarted(preset);
  }, [preset]);

  // Follow the conversation; when the price lands, frame the price card itself.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const card = s.step === "quote" ? el.querySelector<HTMLElement>("[data-quote-card]") : null;
    el.scrollTo({ top: card ? card.offsetTop - 12 : el.scrollHeight, behavior: "smooth" });
  }, [s.messages.length, s.typing, s.step]);

  const q = currentQuote(s.answers);
  const path = questionPath(s.answers);
  const qIndex = path.indexOf(s.step);
  const asking = qIndex >= 0 && !s.quotedAt;
  // Endowed progress: the bar starts with a head start and only moves forward.
  const progress = s.quotedAt ? 100 : asking ? Math.round(18 + (72 * qIndex) / path.length) : 12;
  const secondsLeft = asking ? Math.max(5, (path.length - qIndex) * 5) : 0;
  const days = bookableDays();
  const earliest = days[0];

  const run = async (fn: () => Promise<string | null>) => {
    setSending(true);
    setError(null);
    const err = await fn();
    setSending(false);
    if (err) setError(err);
  };

  return (
    <div
      onPointerDown={armIdle}
      onKeyDown={armIdle}
      className={`flex flex-col overflow-hidden rounded-2xl bg-white text-ink shadow-[0_30px_70px_-30px_rgba(8,18,38,0.55)] ${className}`}
    >
      {/* Header: who, proof, progress */}
      <div className="border-b border-sand px-5 pb-4 pt-5 md:px-6">
        <div className="flex items-center gap-3">
          <span className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink">
            <Image src="/brand/mark.png" alt="" width={300} height={338} className="h-6 w-auto" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-[#22c55e]" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="display whitespace-nowrap text-[1.125rem] leading-tight sm:text-[1.25rem] md:text-[1.375rem]">
              Get Your Instant Price
            </h2>
            <p className="flex items-center gap-1.5 whitespace-nowrap text-[0.8125rem] text-stone">
              <Stars className="text-[#FBBC04]" size={12} />
              <strong className="text-ink">{business.rating.value}</strong> · {business.rating.count} reviews
            </p>
          </div>
          {samplePricing && (
            <span
              title="Prices and offer come from content/pricing.ts and are placeholders until the owner approves them."
              className="shrink-0 rounded-md bg-[#fff4e5] px-2 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-[#9a5b00]"
            >
              Sample<span className="hidden sm:inline"> pricing</span>
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-linen" aria-hidden="true">
            <div
              className="h-full rounded-full bg-gradient-to-r from-hub to-glint transition-[width] duration-700 ease-[var(--ease-out-expo)]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-[0.6875rem] font-bold uppercase tracking-wide text-stone" aria-live="polite">
            {s.booked ? "Booked" : s.quotedAt ? "Price unlocked" : asking ? `${qIndex + 1} of ${path.length} · ~${secondsLeft}s` : "Starting…"}
          </span>
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        aria-live="polite"
        className={`relative space-y-2.5 overflow-y-auto overscroll-contain px-5 py-4 [scrollbar-width:thin] transition-[height] duration-500 md:px-6 ${
          s.step === "quote" ? "h-[24rem] md:h-[25rem]" : "h-[17rem] md:h-[18rem]"
        }`}
      >
        {s.messages.map((m) => (
          <Message key={m.id} m={m} />
        ))}
        {s.typing && (
          <span className="flex w-fit gap-1 rounded-2xl rounded-tl-md bg-linen px-4 py-3.5" aria-label="Assistant is typing">
            {[0, 1, 2].map((i) => (
              <span key={i} className="agent-dot h-1.5 w-1.5 rounded-full bg-stone/60" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </span>
        )}
      </div>

      {/* One decision at a time */}
      <div className="border-t border-sand bg-porcelain/60 px-5 pb-5 pt-4 md:px-6">
        {s.typing ? (
          <div className="h-11" aria-hidden="true" />
        ) : (
          <div className="agent-in">
            {s.step === "service" && (
              <Chips>
                {business.services.map((x) => (
                  <Chip key={x.slug} onClick={() => actions.chooseService(x.slug)}>
                    {x.shortName}
                  </Chip>
                ))}
              </Chips>
            )}

            {s.step === "size" && (
              <Chips cols={2}>
                {pricing.commercial.map((t) => (
                  <Chip key={t.label} onClick={() => actions.chooseSize(t.label)}>
                    {t.label}
                  </Chip>
                ))}
              </Chips>
            )}

            {s.step === "beds" && (
              <Chips cols={6}>
                {BEDROOMS.map((b) => (
                  <Chip key={b.label} onClick={() => actions.chooseBeds(b.value, b.label)}>
                    {b.label}
                  </Chip>
                ))}
              </Chips>
            )}

            {s.step === "baths" && (
              <Chips cols={4}>
                {BATHROOMS.map((b) => (
                  <Chip key={b.label} onClick={() => actions.chooseBaths(b.value, b.label)}>
                    {b.label}
                  </Chip>
                ))}
              </Chips>
            )}

            {s.step === "freq" && (
              <Chips cols={3}>
                {pricing.frequencies.map((f) => {
                  const rec = f.label === pricing.recommendedFrequency;
                  return (
                    <Chip key={f.label} highlight={rec} onClick={() => actions.chooseFreq(f.label)}>
                      {rec && <span className="mb-0.5 block text-[0.625rem] font-bold uppercase tracking-wide text-hub">Recommended</span>}
                      <span className="block">{f.label}</span>
                      {f.discount > 0 && <span className="block text-[0.6875rem] font-bold text-[#15803d]">Save {Math.round(f.discount * 100)}%</span>}
                    </Chip>
                  );
                })}
              </Chips>
            )}

            {s.step === "zip" && <ZipInput onSubmit={(zip) => setError(actions.submitZip(zip))} />}

            {s.step === "contact" && (
              <ContactInput sending={sending} onSubmit={(name, phone) => run(() => actions.submitContact(name, phone))} />
            )}

            {s.step === "quote" && q && (
              <div className="grid gap-2.5">
                <button type="button" onClick={actions.startBooking} className="btn btn-primary !h-14 w-full !text-base">
                  {q.kind === "startingAt" ? "Book my walkthrough" : "Book my clean"}
                  <span className="text-[0.8125rem] font-semibold opacity-80">· earliest {earliest?.short} {earliest?.date}</span>
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

            {s.step === "date" && (
              <div>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {(allDates ? days : days.slice(0, booking.daysShown)).map((d, i) => (
                    <button
                      key={d.iso}
                      type="button"
                      onClick={() => actions.chooseDate(d.iso, d.label)}
                      className={`relative rounded-xl border-[1.5px] bg-white px-2 py-2.5 text-center transition-colors hover:border-hub hover:text-hub ${
                        i === 0 ? "border-hub" : "border-sand"
                      }`}
                    >
                      {i === 0 && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-hub px-1.5 text-[0.5625rem] font-bold uppercase tracking-wide text-white">
                          Earliest
                        </span>
                      )}
                      <span className="block text-[0.6875rem] font-bold uppercase tracking-wide text-stone">{d.short}</span>
                      <span className="block whitespace-nowrap text-[0.875rem] font-bold">{d.date}</span>
                    </button>
                  ))}
                </div>
                {!allDates && days.length > booking.daysShown && (
                  <button type="button" onClick={() => setAllDates(true)} className="mt-2.5 text-[0.8125rem] font-bold text-hub hover:underline">
                    More dates
                  </button>
                )}
              </div>
            )}

            {s.step === "time" && (
              <Chips cols={2}>
                {booking.windows.map((w) => (
                  <Chip key={w} onClick={() => actions.chooseWindow(w)}>
                    {w}
                  </Chip>
                ))}
              </Chips>
            )}

            {s.step === "confirm" && (
              <div className="grid gap-2.5">
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => run(actions.confirmBooking)}
                  className="btn btn-primary !h-14 w-full !text-base"
                >
                  {sending ? "Booking…" : "Lock it in"} <Icon name="check" size={18} strokeWidth={2.2} />
                </button>
                <button type="button" onClick={actions.changeTime} className="text-[0.8125rem] font-bold text-stone hover:text-ink">
                  Pick a different time
                </button>
              </div>
            )}

            {s.step === "done" && (
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[0.875rem] font-bold text-[#15803d]">
                  <Icon name="check" size={17} strokeWidth={2.4} /> Booking requested
                </span>
                <button type="button" onClick={actions.restart} className="text-[0.8125rem] font-bold text-stone hover:text-ink">
                  New quote
                </button>
              </div>
            )}

            {error && (
              <p role="alert" className="mt-2.5 text-[0.8125rem] font-semibold text-[#b42318]">
                {error}
              </p>
            )}

            {(s.step === "service" || s.step === "beds" || s.step === "size") && !s.quotedAt && (
              <p className="mt-3 text-center text-[0.75rem] text-stone">
                No calls needed. Rather talk?{" "}
                <a href={business.contact.phoneHref} className="font-bold text-ink hover:underline">
                  {business.contact.phoneDisplay}
                </a>
              </p>
            )}
            {s.answers.service && !s.quotedAt && s.step !== "service" && (
              <button type="button" onClick={actions.restart} className="mt-2 block w-full text-center text-[0.75rem] text-stone hover:text-ink">
                Start over
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Messages ──────────────────────────────────────────────── */

function Message({ m }: { m: Msg }) {
  if ("card" in m) {
    if (m.card === "preview") return <PreviewCard />;
    if (m.card === "quote") return <QuoteCard />;
    return <ReviewCard />;
  }
  return m.from === "bot" ? (
    <p className="agent-in max-w-[88%] rounded-2xl rounded-tl-md bg-linen px-4 py-2.5 text-[0.9375rem] leading-snug">{m.text}</p>
  ) : (
    <p className="agent-in ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-md bg-hub px-4 py-2.5 text-[0.9375rem] font-semibold leading-snug text-white">
      {m.text}
    </p>
  );
}

/** Curiosity gap: the price exists, it just needs a phone number to unlock. */
function PreviewCard() {
  return (
    <div className="agent-in on-ink relative overflow-hidden rounded-2xl bg-ink px-4 py-4 text-white">
      <p className="text-[0.8125rem] text-mist">Your exact price</p>
      <p className="display mt-1 select-none text-[2rem] leading-none blur-[7px]" aria-hidden="true">
        $1,234
      </p>
      <p className="mt-2 select-none text-[0.75rem] text-mist blur-[4px]" aria-hidden="true">
        Includes everything below
      </p>
      <span className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[0.75rem] font-bold ring-1 ring-white/15">
        <Icon name="key" size={14} /> Unlocks below
      </span>
    </div>
  );
}

function QuoteCard() {
  const s = useSyncExternalStore(quoteStore.subscribe, quoteStore.get, quoteStore.getServer);
  const q = currentQuote(s.answers);
  const svc = serviceOf(s.answers.service);
  if (!q || !svc) return null;
  const first = s.answers.name?.split(" ")[0];
  const summary =
    q.kind === "startingAt"
      ? s.answers.sizeTier
      : [s.answers.bedrooms === 0 ? "Studio" : `${s.answers.bedrooms} bed`, `${s.answers.bathrooms} bath`, s.answers.frequency]
          .filter(Boolean)
          .join(" · ");
  const stack = [
    svc.focus[0],
    svc.focus[1],
    "Cleaned to your priorities, not a generic checklist",
    `${business.guarantee.hours}-hour make-it-right promise: miss anything, we come back and fix it`,
  ];

  return (
    <div data-quote-card className="agent-in on-ink overflow-hidden rounded-2xl bg-ink text-white">
      <div className="px-4 pb-3 pt-4">
        <p className="text-[0.8125rem] text-mist">{first ? `${first}, your price:` : "Your price:"}</p>
        <p className="display mt-1 text-[2.25rem] leading-none">
          {formatQuote(q)}
          <span className="ml-1.5 align-middle font-sans text-[0.8125rem] font-semibold tracking-normal text-mist">{q.unit}</span>
        </p>
        {q.oneTime && q.savings ? (
          <p className="mt-2 text-[0.8125rem]">
            <span className="text-mist line-through">${q.oneTime} one-time</span>{" "}
            <span className="font-bold text-glint">You save ${q.savings} every clean</span>
          </p>
        ) : null}
        <p className="mt-1.5 text-[0.75rem] text-mist">
          {svc.name}
          {summary && ` · ${summary}`}
        </p>
      </div>
      <ul className="space-y-1.5 border-t border-white/10 px-4 py-3 text-[0.8125rem]">
        {stack.map((p) => (
          <li key={p} className="flex gap-2">
            <Icon name="check" size={14} strokeWidth={2.4} className="mt-0.5 shrink-0 text-glint" />
            {p}
          </li>
        ))}
      </ul>
      {(offer.bonus || offer.priceLockDays) && (
        <div className="space-y-1.5 border-t border-white/10 bg-white/[0.04] px-4 py-3 text-[0.8125rem]">
          {offer.bonus && (
            <p className="flex gap-2">
              <Icon name="badge" size={15} className="mt-0.5 shrink-0 text-[#FBBC04]" />
              <span>
                <strong>Bonus:</strong> {offer.bonus}
              </span>
            </p>
          )}
          {offer.priceLockDays > 0 && (
            <p className="flex gap-2 text-mist">
              <Icon name="clock" size={15} className="mt-0.5 shrink-0" />
              Price held for {offer.priceLockDays} days. We&rsquo;ll text you a link to book any time.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** Social proof at the moment of decision. */
function ReviewCard() {
  const r = business.googleReviews[0];
  if (!r) return null;
  return (
    <figure className="agent-in max-w-[92%] rounded-2xl rounded-tl-md border border-sand bg-white px-4 py-3">
      <Stars className="text-[#FBBC04]" size={12} />
      <blockquote className="mt-1.5 text-[0.8125rem] leading-snug">&ldquo;{r.text}&rdquo;</blockquote>
      <figcaption className="mt-1.5 text-[0.6875rem] text-stone">
        {r.name} · Google{r.placeholder ? " · Sample" : ""}
      </figcaption>
    </figure>
  );
}

/* ─── Inputs ────────────────────────────────────────────────── */

function Chips({ children, cols }: { children: React.ReactNode; cols?: number }) {
  const grid = cols ? { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 6: "grid-cols-3 sm:grid-cols-6" }[cols] : "";
  return <div className={cols ? `grid gap-2 ${grid}` : "flex flex-wrap gap-2"}>{children}</div>;
}

function Chip({ children, onClick, highlight }: { children: React.ReactNode; onClick: () => void; highlight?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-xl border-[1.5px] bg-white px-3 py-2 text-[0.9375rem] font-bold text-ink transition-all duration-200 hover:-translate-y-px hover:border-hub hover:text-hub active:translate-y-0 ${
        highlight ? "border-hub ring-2 ring-hub/15" : "border-sand"
      }`}
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
      <div className="grid grid-cols-[1fr_1.25fr] gap-2">
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
        {sending ? "Unlocking…" : "Unlock my price"} <Icon name="key" size={16} />
      </button>
      <p className="text-[0.625rem] leading-snug text-stone">{smsConsent}</p>
    </form>
  );
}
