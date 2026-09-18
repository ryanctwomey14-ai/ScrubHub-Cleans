"use client";

import { useEffect, useState } from "react";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { QuoteCta } from "@/components/quote/QuoteCta";
import { useNextOpening } from "@/lib/use-next-opening";
import { ServiceMap } from "./ServiceMap";

const PINS = business.neighborhoods;
const OUTLINE = business.serviceAreaOutline;

/**
 * "Do you come to me?" answered on a real map: the coverage area draws itself
 * in, pins drop onto each neighborhood, and every path ends at the same next
 * step, the instant price and booking.
 */
export function ServiceArea() {
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [picked, setPicked] = useState(false);
  const opening = useNextOpening();

  // Start the intro when the section is actually on screen.
  useEffect(() => {
    const el = document.getElementById("service-area");
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Gently tour the pins until the visitor picks one (skipped for reduced motion).
  useEffect(() => {
    if (!inView || picked) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const start = setTimeout(() => setActive(0), 3200);
    const tour = setInterval(() => {
      i = (i + 1) % PINS.length;
      setActive(i);
    }, 2400);
    return () => {
      clearTimeout(start);
      clearInterval(tour);
    };
  }, [inView, picked]);

  const pick = (i: number, fly: boolean) => {
    setPicked(true);
    setActive(i);
    if (fly) setFocus(i);
  };

  const current = active === null ? null : PINS[active];

  return (
    <section id="service-area" className="section !pt-4" aria-labelledby="area-title">
      <div className="shell">
        <div
          data-reveal
          className="grid overflow-hidden rounded-3xl border border-sand bg-white lg:grid-cols-[1fr_1.15fr] lg:grid-rows-[auto_1fr]"
        >
          {/* Heading */}
          <div className="px-6 pt-8 md:px-12 md:pt-12">
            <p className="eyebrow">Service area</p>
            <h2 id="area-title" className="display h2 mt-4 max-w-[16ch]">
              Cleaning Homes All Over <em>{business.location.city}.</em>
            </h2>
            <p className="mt-4 max-w-md text-stone">
              From the city neighborhoods to the suburbs, we come to you. See your price and book your clean in
              about 60 seconds.
            </p>
          </div>

          {/* Map */}
          <div className="on-ink relative mt-8 h-[23rem] overflow-hidden bg-[#0b1630] sm:h-[28rem] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0 lg:h-auto lg:min-h-[36rem]">
            <ServiceMap pins={PINS} outline={OUTLINE} active={active} focus={focus} inView={inView} onPick={pick} />

            {/* Edge fade so the map sits inside the card */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_20px_rgba(8,18,38,0.55)]"
            />
            <span className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-night/75 px-3 py-1.5 text-[0.75rem] font-bold text-white ring-1 ring-white/10 backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full border-2 border-glint bg-glint/30" aria-hidden="true" />
              Our service area
            </span>
            {focus !== null && (
              <button
                type="button"
                onClick={() => setFocus(null)}
                className="agent-in absolute bottom-4 left-4 flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[0.8125rem] font-bold text-ink shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]"
              >
                <Icon name="pin" size={15} className="text-hub" /> Show whole area
              </button>
            )}
          </div>

          {/* Action */}
          <div className="px-6 pb-8 pt-7 md:px-12 md:pb-12 lg:col-start-1 lg:row-start-2 lg:pt-8">
            <ul className="hidden flex-wrap gap-2 sm:flex">
              {PINS.map((p, i) => (
                <li key={p.name}>
                  <button
                    type="button"
                    onClick={() => pick(i, true)}
                    onMouseEnter={() => pick(i, false)}
                    aria-pressed={active === i}
                    className="rounded-full border-[1.5px] border-sand px-3.5 py-1.5 text-[0.8125rem] font-semibold text-ink transition-colors hover:border-hub aria-[pressed=true]:border-hub aria-[pressed=true]:bg-hub aria-[pressed=true]:text-white"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>

            <div
              aria-live={picked ? "polite" : "off"}
              className="flex items-center gap-3.5 rounded-2xl bg-linen p-4 sm:mt-6"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#22c55e] text-white">
                <Icon name="check" size={18} strokeWidth={2.6} />
              </span>
              <span className="min-w-0 leading-snug">
                <span className="block font-bold text-ink">
                  {current ? `Yes, we clean in ${current.name}!` : `We clean all over ${business.location.city}.`}
                </span>
                <span className="block min-h-[1.25rem] text-[0.875rem] text-stone">
                  {opening && (
                    <>
                      Next opening: <strong className="text-ink">{opening}</strong>
                    </>
                  )}
                </span>
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
              <QuoteCta from="service_area" className="btn btn-primary w-full sm:w-auto" />
              <p className="text-center text-[0.875rem] text-stone sm:text-left">
                Instant price and booking. No phone call needed.
              </p>
            </div>
            <p className="mt-5 text-[0.8125rem] text-stone">
              Don&rsquo;t see your area? We probably still cover it. Call or text{" "}
              <a href={business.contact.phoneHref} className="-my-2 inline-block py-2 font-bold text-ink">
                {business.contact.phoneDisplay}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
