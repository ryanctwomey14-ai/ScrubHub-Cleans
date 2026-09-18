"use client";

import { useState } from "react";
import { business, cityLabel } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { QuoteCta } from "@/components/quote/QuoteCta";
import { inServiceArea } from "@/lib/quote";
import { track } from "@/lib/track";

type Result = "idle" | "yes" | "maybe";

/**
 * "Do you come to me?" answered in one tap. A zip check is a small yes that
 * leads straight into the quote; out-of-area visitors get a human, not a dead end.
 */
export function ServiceArea() {
  const [zip, setZip] = useState("");
  const [result, setResult] = useState<Result>("idle");
  const valid = /^\d{5}$/.test(zip);

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) return;
    const ok = inServiceArea(zip);
    setResult(ok ? "yes" : "maybe");
    track("zip_check", { zip, covered: ok });
  };

  return (
    <section className="section !pt-4" aria-labelledby="area-title">
      <div className="shell">
        <div
          data-reveal
          className="grid overflow-hidden rounded-3xl border border-sand bg-white lg:grid-cols-[1.05fr_1fr]"
        >
          {/* Check */}
          <div className="p-7 md:p-12">
            <p className="eyebrow">Service area</p>
            <h2 id="area-title" className="display h2 mt-4 max-w-[16ch]">
              Cleaning Homes All Over <em>{business.location.city}.</em>
            </h2>
            <p className="mt-4 max-w-md text-stone">
              From the city neighborhoods to the suburbs, we come to you. Check your zip and see your price in
              about 60 seconds.
            </p>

            <form onSubmit={check} className="mt-7 flex max-w-md gap-2" noValidate>
              <label htmlFor="area-zip" className="sr-only">
                Your zip code
              </label>
              <input
                id="area-zip"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={5}
                placeholder="Your zip code"
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value.replace(/\D/g, "").slice(0, 5));
                  setResult("idle");
                }}
                className="field flex-1"
              />
              <button type="submit" disabled={!valid} className="btn btn-ink shrink-0 disabled:opacity-50">
                Check
              </button>
            </form>

            <div aria-live="polite" className="min-h-[3.25rem]">
              {result === "yes" && (
                <div className="agent-in mt-5 flex flex-wrap items-center gap-x-5 gap-y-4">
                  <p className="flex items-center gap-2.5 font-bold text-ink">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[#22c55e] text-white">
                      <Icon name="check" size={15} strokeWidth={2.6} />
                    </span>
                    Yes, we clean in {zip}!
                  </p>
                  <QuoteCta from="zip_check" />
                </div>
              )}
              {result === "maybe" && (
                <div className="agent-in mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
                  <p className="max-w-sm text-[0.9375rem] text-stone">
                    {zip} may be just outside our usual route. Text us and we&rsquo;ll do our best to fit you in.
                  </p>
                  <a href={business.contact.smsHref} className="btn btn-ghost">
                    <Icon name="message" size={16} /> Text {business.contact.phoneDisplay}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Coverage */}
          <div className="on-ink relative overflow-hidden bg-ink p-7 text-white md:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
              style={{ background: "radial-gradient(circle, #3fd8f2, transparent 65%)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.8125rem] font-bold uppercase tracking-[0.1em] text-mist">
                  Serving {cityLabel} &amp; nearby
                </p>
                {!business.neighborhoodsConfirmed && (
                  <span
                    title="Sample neighborhoods. Replace with the owner's real coverage in content/business.ts."
                    className="rounded-md bg-[#fff4e5] px-2 py-1 text-[0.625rem] font-bold uppercase tracking-wide text-[#9a5b00]"
                  >
                    Sample list
                  </span>
                )}
              </div>
              <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3.5 sm:grid-cols-3">
                {business.neighborhoods.map((n) => (
                  <li key={n} className="flex items-center gap-2 text-[0.9375rem] font-semibold text-white/90">
                    <Icon name="pin" size={15} className="shrink-0 text-glint" />
                    {n}
                  </li>
                ))}
              </ul>
              <p className="mt-8 border-t border-white/10 pt-5 text-[0.875rem] text-white/65">
                Don&rsquo;t see your area? We probably still cover it. Your zip is confirmed with your quote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
