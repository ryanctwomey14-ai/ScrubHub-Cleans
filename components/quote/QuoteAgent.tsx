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
  nextAvailable,
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
 *   time delay ↓ (real price in 60s, next open slot)  ·  effort ↓ (taps, one-tap booking)
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
    const target = s.step === "quote" ? el.querySelector<HTMLElement>("[data-quote-card]") : null;
    el.scrollTo({ top: target ? target.offsetTop - 12 : el.scrollHeight, behavior: "smooth" });
  }, [s.messages.length, s.typing, s.step]);

  const q = currentQuote(s.answers);
  const path = questionPath(s.answers);
  const qIndex = path.indexOf(s.step);
  const asking = qIndex >= 0 && !s.quotedAt;
  // Endowed progress: the bar starts with a head start and only moves forward.
  const progress = s.quotedAt ? 100 : asking ? Math.round(18 + (72 * qIndex) / path.length) : 12;
  const secondsLeft = asking ? Math.max(5, (path.length - qIndex) * 8) : 0;
  const days = bookableDays();
  const next = nextAvailable();
  const tall = s.step === "quote" || s.step === "card";

  const run = async (fn: () => Promise<string | null>) => {
    setSending(true);
    setError(null);
    const err = await fn();
    setSending(false);
    if (err) setError(err);
  };

  const status = s.cardAdded
    ? "Locked in"
    : s.booked
      ? "Booked"
      : s.quotedAt
        ? "Your price"
        : asking
          ? `${qIndex + 1} of ${path.length} · ~${secondsLeft}s`
          : "Starting…";

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
              Real Quote in 60 Seconds
            </h2>
            <p className="flex items-center gap-1.5 whitespace-nowrap text-[0.8125rem] text-stone">
              <Stars className="text-[#FBBC04]" size={12} />
              <strong className="text-ink">{business.rating.value}</strong> · {business.rating.count} reviews
            </p>
          </div>
          {samplePricing && (
            <span
              title="Prices, offer, and availability are demo placeholders from content/pricing.ts."
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
            {status}
          </span>
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        aria-live="polite"
        className={`relative space-y-2.5 overflow-y-auto overscroll-contain px-5 py-4 [scrollbar-width:thin] transition-[height] duration-500 md:px-6 ${
          tall ? "h-[24rem] md:h-[25rem]" : "h-[15rem]"
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

            {s.step === "rooms" && <RoomsInput />}

            {s.step === "sqft" && (
              <Chips cols={3}>
                {pricing.sqftTiers.map((t) => (
                  <Chip key={t.label} onClick={() => actions.chooseSqft(t.label)}>
                    <span className="block">{t.label}</span>
                    <span className="block text-[0.6875rem] font-semibold text-stone">sq ft</span>
                  </Chip>
                ))}
              </Chips>
            )}

            {s.step === "condition" && (
              <div className="grid gap-2 sm:grid-cols-2">
                {pricing.conditions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => actions.chooseCondition(c.id)}
                    className="rounded-xl border-[1.5px] border-sand bg-white px-3.5 py-2.5 text-left transition-all duration-200 hover:-translate-y-px hover:border-hub"
                  >
                    <span className="block text-[0.9375rem] font-bold">{c.label}</span>
                    <span className="block text-[0.75rem] leading-snug text-stone">{c.detail}</span>
                  </button>
                ))}
              </div>
            )}

            {s.step === "freq" && (
              <Chips cols={2}>
                {pricing.frequencies.map((f) => {
                  const rec = f.label === pricing.recommendedFrequency;
                  return (
                    <Chip key={f.label} highlight={rec} onClick={() => actions.chooseFreq(f.label)}>
                      {rec && <span className="mb-0.5 block text-[0.625rem] font-bold uppercase tracking-wide text-hub">Recommended</span>}
                      <span className="block">{f.label}</span>
                      <span className={`block text-[0.6875rem] font-bold ${f.discount > 0 ? "text-[#15803d]" : "text-stone"}`}>
                        {f.discount > 0 ? `Save ${Math.round(f.discount * 100)}% every visit` : "Full price"}
                      </span>
                    </Chip>
                  );
                })}
              </Chips>
            )}

            {s.step === "addons" && <AddOnsInput />}

            {s.step === "contact" && (
              <ContactInput sending={sending} onSubmit={(f) => run(() => actions.submitContact(f))} />
            )}

            {s.step === "zip" && <ZipInput sending={sending} onSubmit={(zip) => run(() => actions.submitZip(zip))} />}

            {s.step === "quote" && q && (
              <div className="grid gap-2.5">
                <div className="flex items-center justify-between gap-3 rounded-xl border-[1.5px] border-hub/30 bg-white px-4 py-3">
                  <span>
                    <span className="block text-[0.6875rem] font-bold uppercase tracking-wide text-hub">Next available</span>
                    <span className="block text-[1rem] font-bold">
                      {next.label} · {next.window}
                    </span>
                  </span>
                  <Icon name="clock" size={20} className="text-hub" />
                </div>
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => run(actions.bookNextAvailable)}
                  className="btn btn-primary !h-14 w-full !text-base"
                >
                  {sending ? "Booking…" : q.kind === "startingAt" ? "Yes, book my walkthrough" : "Yes, book it"}
                  <Icon name="arrow" size={18} className="btn-arrow" />
                </button>
                <div className="flex items-center justify-between text-[0.8125rem]">
                  <button type="button" onClick={actions.seeOtherTimes} className="font-bold text-hub hover:underline">
                    See other times
                  </button>
                  <button
                    type="button"
                    onClick={() => window.dispatchEvent(new Event("scrubhub:chat"))}
                    className="font-bold text-ink hover:underline"
                  >
                    I have a question
                  </button>
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
                  <Chip key={w} onClick={() => run(() => actions.chooseWindow(w))}>
                    {w}
                  </Chip>
                ))}
              </Chips>
            )}

            {s.step === "card" && <CardInput sending={sending} onSubmit={() => run(actions.addCard)} />}

            {s.step === "done" && (
              <div className="flex items-center justify-between gap-3">
                <span className="flex items-center gap-2 text-[0.875rem] font-bold text-[#15803d]">
                  <Icon name="check" size={17} strokeWidth={2.4} /> {s.cardAdded ? "Booked & locked in" : "Booked"}
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

            {(s.step === "service" || s.step === "rooms" || s.step === "size") && !s.quotedAt && (
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
    if (m.card === "quote") return <QuoteCard />;
    if (m.card === "booked") return <BookedCard />;
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

function QuoteCard() {
  const s = useSyncExternalStore(quoteStore.subscribe, quoteStore.get, quoteStore.getServer);
  const q = currentQuote(s.answers);
  const svc = serviceOf(s.answers.service);
  if (!q || !svc) return null;
  const first = s.answers.name?.split(" ")[0];

  return (
    <div data-quote-card className="agent-in on-ink overflow-hidden rounded-2xl bg-ink text-white">
      <div className="px-4 pb-3 pt-4">
        <p className="text-[0.8125rem] text-mist">{first ? `${first}, your quote:` : "Your quote:"}</p>
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
      </div>

      {/* Itemized: a price that shows its work feels real */}
      <dl className="space-y-1 border-t border-white/10 px-4 py-3 text-[0.8125rem]">
        {q.lines.map((l) => (
          <div key={l.label} className="flex justify-between gap-3">
            <dt className="text-white/80">{l.label}</dt>
            <dd className={`shrink-0 font-semibold tabular-nums ${l.amount < 0 ? "text-glint" : ""}`}>
              {l.amount < 0 ? `−$${Math.abs(l.amount)}` : `$${l.amount}`}
            </dd>
          </div>
        ))}
        <div className="flex justify-between gap-3 border-t border-white/10 pt-1.5 font-bold">
          <dt>Total {q.unit}</dt>
          <dd className="tabular-nums">{formatQuote(q)}</dd>
        </div>
      </dl>

      <ul className="space-y-1.5 border-t border-white/10 px-4 py-3 text-[0.8125rem]">
        {["Cleaned to your priorities, not a generic checklist", `${business.guarantee.hours}-hour make-it-right promise: miss anything, we come back and fix it`].map(
          (p) => (
            <li key={p} className="flex gap-2">
              <Icon name="check" size={14} strokeWidth={2.4} className="mt-0.5 shrink-0 text-glint" />
              {p}
            </li>
          ),
        )}
        {offer.bonus && (
          <li className="flex gap-2">
            <Icon name="badge" size={15} className="mt-0.5 shrink-0 text-[#FBBC04]" />
            <span>
              <strong>Bonus:</strong> {offer.bonus}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}

function BookedCard() {
  const s = useSyncExternalStore(quoteStore.subscribe, quoteStore.get, quoteStore.getServer);
  const q = currentQuote(s.answers);
  const day = bookableDays().find((d) => d.iso === s.answers.date);
  return (
    <div className="agent-in rounded-2xl border-[1.5px] border-[#15803d]/30 bg-[#f0fdf4] px-4 py-3.5">
      <p className="flex items-center gap-2 text-[0.8125rem] font-bold uppercase tracking-wide text-[#15803d]">
        <Icon name="check" size={16} strokeWidth={2.6} /> You&rsquo;re booked
      </p>
      <p className="mt-1.5 text-[1.0625rem] font-bold">
        {day?.label ?? s.answers.date} · {s.answers.window}
      </p>
      {q && (
        <p className="text-[0.8125rem] text-stone">
          {q.serviceName} · {formatQuote(q)} {q.unit}
        </p>
      )}
    </div>
  );
}

/** Social proof at the moment of decision: the shortest real review, so it reads at a glance. */
const decisionReview = [...business.reviews].sort((a, b) => a.text.length - b.text.length)[0];

function ReviewCard() {
  const r = decisionReview;
  if (!r) return null;
  return (
    <figure className="agent-in max-w-[92%] rounded-2xl rounded-tl-md border border-sand bg-white px-4 py-3">
      <Stars className="text-[#FBBC04]" size={12} />
      <blockquote className="mt-1.5 text-[0.8125rem] leading-snug">&ldquo;{r.text}&rdquo;</blockquote>
      <figcaption className="mt-1.5 text-[0.6875rem] text-stone">
        {r.name} · {business.reviewsSource} review
      </figcaption>
    </figure>
  );
}

/* ─── Inputs ────────────────────────────────────────────────── */

function Chips({ children, cols }: { children: React.ReactNode; cols?: number }) {
  const grid = cols ? { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 6: "grid-cols-3 sm:grid-cols-6" }[cols] : "";
  return <div className={cols ? `grid gap-2 ${grid}` : "flex flex-wrap gap-2"}>{children}</div>;
}

function Chip({
  children,
  onClick,
  highlight,
  selected,
}: {
  children: React.ReactNode;
  onClick: () => void;
  highlight?: boolean;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`min-h-11 rounded-xl border-[1.5px] px-3 py-2 text-[0.9375rem] font-bold transition-all duration-200 hover:-translate-y-px hover:border-hub active:translate-y-0 ${
        selected ? "border-hub bg-hub text-white" : highlight ? "border-hub bg-white text-ink ring-2 ring-hub/15" : "border-sand bg-white text-ink hover:text-hub"
      }`}
    >
      {children}
    </button>
  );
}

/** Bedrooms + bathrooms on one screen; advances the moment both are picked. */
function RoomsInput() {
  const [beds, setBeds] = useState<number | null>(null);
  const [baths, setBaths] = useState<number | null>(null);
  const pick = (b: number | null, t: number | null) => {
    if (b !== null && t !== null) actions.chooseRooms(b, t);
  };
  return (
    <div className="grid gap-3">
      <div>
        <p className="mb-1.5 text-[0.75rem] font-bold uppercase tracking-wide text-stone">Bedrooms</p>
        <Chips cols={6}>
          {BEDROOMS.map((b) => (
            <Chip
              key={b.label}
              selected={beds === b.value}
              onClick={() => {
                setBeds(b.value);
                pick(b.value, baths);
              }}
            >
              {b.label}
            </Chip>
          ))}
        </Chips>
      </div>
      <div>
        <p className="mb-1.5 text-[0.75rem] font-bold uppercase tracking-wide text-stone">Bathrooms</p>
        <Chips cols={4}>
          {BATHROOMS.map((b) => (
            <Chip
              key={b.label}
              selected={baths === b.value}
              onClick={() => {
                setBaths(b.value);
                pick(beds, b.value);
              }}
            >
              {b.label}
            </Chip>
          ))}
        </Chips>
      </div>
    </div>
  );
}

function AddOnsInput() {
  const [picked, setPicked] = useState<string[]>([]);
  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div>
      <div className="grid max-h-[11.5rem] grid-cols-2 gap-2 overflow-y-auto pr-1 [scrollbar-width:thin]" data-lenis-prevent>
        {pricing.addOns.map((a) => {
          const on = picked.includes(a.id);
          return (
            <label
              key={a.id}
              className={`flex cursor-pointer items-center gap-2.5 rounded-xl border-[1.5px] bg-white px-3 py-2.5 transition-colors ${
                on ? "border-hub bg-hub/5" : "border-sand hover:border-hub/50"
              }`}
            >
              <input type="checkbox" checked={on} onChange={() => toggle(a.id)} className="h-4 w-4 shrink-0 accent-[#1a5fe8]" />
              <span className="min-w-0 flex-1 text-[0.8125rem] font-bold leading-tight">{a.label}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
        <button type="button" onClick={() => actions.chooseAddOns(picked)} className="btn btn-primary !h-12">
          {picked.length ? `Add ${picked.length} extra${picked.length > 1 ? "s" : ""}` : "Continue"}
          <Icon name="arrow" size={16} />
        </button>
        {picked.length === 0 && (
          <button type="button" onClick={() => actions.chooseAddOns([])} className="btn btn-ghost !h-12 !px-4">
            Skip
          </button>
        )}
      </div>
    </div>
  );
}

function ContactInput({
  onSubmit,
  sending,
}: {
  onSubmit: (f: { name: string; phone: string; email: string }) => void;
  sending: boolean;
}) {
  const [f, setF] = useState({ name: "", phone: "", email: "" });
  const bind = (k: keyof typeof f) => ({
    value: f[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value })),
  });
  return (
    <form
      className="grid gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(f);
      }}
    >
      <div className="grid grid-cols-2 gap-2">
        <label htmlFor="agent-name" className="sr-only">First name</label>
        <input id="agent-name" autoComplete="given-name" placeholder="First name" className="field !h-12" {...bind("name")} />
        <label htmlFor="agent-phone" className="sr-only">Mobile number</label>
        <input id="agent-phone" type="tel" autoComplete="tel" placeholder="Mobile number" className="field !h-12" {...bind("phone")} />
      </div>
      <label htmlFor="agent-email" className="sr-only">Email</label>
      <input id="agent-email" type="email" autoComplete="email" placeholder="Email" className="field !h-12" {...bind("email")} />
      <button type="submit" disabled={sending} className="btn btn-primary !h-12 w-full">
        {sending ? "Saving…" : "Build my quote"} <Icon name="arrow" size={16} className="btn-arrow" />
      </button>
      <p className="text-[0.625rem] leading-snug text-stone">{smsConsent}</p>
    </form>
  );
}

function ZipInput({ onSubmit, sending }: { onSubmit: (zip: string) => void; sending: boolean }) {
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
      <button type="submit" disabled={sending} className="btn btn-primary !h-12 !px-5">
        {sending ? "Pricing…" : "See my price"} <Icon name="arrow" size={16} />
      </button>
    </form>
  );
}

/**
 * DEMO card step. Nothing typed here is sent or stored anywhere: the fields
 * have no names, autofill is off, and submit only records "card added (demo)".
 * The live version replaces this with Stripe's hosted card element.
 */
function CardInput({ onSubmit, sending }: { onSubmit: () => void; sending: boolean }) {
  return (
    <form
      className="grid gap-2"
      autoComplete="off"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="rounded-xl border-[1.5px] border-sand bg-white p-3">
        <label htmlFor="demo-card" className="sr-only">Card number (demo)</label>
        <input
          id="demo-card"
          inputMode="numeric"
          autoComplete="off"
          data-1p-ignore
          data-lpignore="true"
          placeholder="Card number"
          className="w-full bg-transparent text-[0.9375rem] outline-none placeholder:text-[#8791a6]"
        />
        <div className="mt-2 grid grid-cols-3 gap-2 border-t border-sand pt-2">
          <label htmlFor="demo-exp" className="sr-only">Expiry (demo)</label>
          <input id="demo-exp" autoComplete="off" data-1p-ignore data-lpignore="true" placeholder="MM / YY" className="bg-transparent text-[0.9375rem] outline-none placeholder:text-[#8791a6]" />
          <label htmlFor="demo-cvc" className="sr-only">CVC (demo)</label>
          <input id="demo-cvc" autoComplete="off" data-1p-ignore data-lpignore="true" placeholder="CVC" className="bg-transparent text-[0.9375rem] outline-none placeholder:text-[#8791a6]" />
          <label htmlFor="demo-zip" className="sr-only">Billing zip (demo)</label>
          <input id="demo-zip" autoComplete="off" data-1p-ignore data-lpignore="true" placeholder="Zip" className="bg-transparent text-[0.9375rem] outline-none placeholder:text-[#8791a6]" />
        </div>
      </div>
      <button type="submit" disabled={sending} className="btn btn-primary !h-12 w-full">
        {sending ? "Locking in…" : "Lock in my cleaner"} <Icon name="shield" size={16} />
      </button>
      <p className="flex items-center justify-center gap-1.5 text-center text-[0.75rem] font-semibold text-ink">
        <Icon name="check" size={13} strokeWidth={2.6} className="text-[#15803d]" /> $0 today. {offer.payment}
      </p>
      <div className="flex items-center justify-between text-[0.6875rem] text-stone">
        <span>Demo: no card details are sent or saved.</span>
        <button type="button" onClick={actions.skipCard} className="font-bold hover:text-ink">
          Add it from the email instead
        </button>
      </div>
    </form>
  );
}
