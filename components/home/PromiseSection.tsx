"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { gsap, prefersReducedMotion } from "@/lib/motion";

const R = 180;
const CIRC = 2 * Math.PI * R;
const beats = ["You tell us.", "We come back.", "It's made right."];

export function PromiseSection() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion() || !root.current) return;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      const build = (scrollTrigger: ScrollTrigger.Vars) => {
        const tl = gsap.timeline({ scrollTrigger });
        tl.fromTo(
          "[data-hand]",
          { rotation: 0, svgOrigin: "200 200" },
          { rotation: 360, svgOrigin: "200 200", ease: "none", duration: 3 },
          0,
        )
          .fromTo("[data-arc]", { strokeDashoffset: CIRC }, { strokeDashoffset: 0, ease: "none", duration: 3 }, 0)
          .fromTo("[data-beat]", { opacity: 0.18 }, { opacity: 1, duration: 0.5, stagger: 1 }, 0.3);
        return tl;
      };

      mm.add("(min-width: 1024px)", () => {
        build({ trigger: root.current, start: "top top", end: "+=110%", scrub: 0.8, pin: true, anticipatePin: 1 });
      });
      mm.add("(max-width: 1023px)", () => {
        build({ trigger: root.current, start: "top 70%", end: "bottom 70%", scrub: 0.8 });
      });
    }, root);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      className="on-ink relative overflow-hidden bg-ink text-porcelain"
      aria-labelledby="promise-title"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-10%] top-1/2 h-[46rem] w-[46rem] -translate-y-1/2 rounded-full opacity-[0.14] blur-3xl"
        style={{ background: "radial-gradient(circle, #3fd8f2, transparent 62%)" }}
      />

      <div className="shell relative flex min-h-[100svh] items-center py-24 lg:py-0">
        <div className="grid w-full items-center gap-16 lg:grid-cols-2 lg:gap-20">
          {/* Clock */}
          <div className="mx-auto w-full max-w-[26rem] lg:max-w-[32rem]">
            <svg viewBox="0 0 400 400" className="w-full" role="img" aria-label="A clock face marking 24 hours">
              <circle cx="200" cy="200" r={R} fill="none" stroke="rgba(247,245,240,0.12)" strokeWidth="1" />
              <circle
                data-arc
                cx="200"
                cy="200"
                r={R}
                fill="none"
                stroke="#3fd8f2"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={0}
                transform="rotate(-90 200 200)"
              />
              {Array.from({ length: 24 }).map((_, i) => {
                const major = i % 6 === 0;
                const a = (i / 24) * Math.PI * 2;
                const r1 = major ? 150 : 158;
                const r2 = 166;
                const p = (n: number) => Math.round(n * 100) / 100;
                return (
                  <line
                    key={i}
                    x1={p(200 + r1 * Math.sin(a))}
                    y1={p(200 - r1 * Math.cos(a))}
                    x2={p(200 + r2 * Math.sin(a))}
                    y2={p(200 - r2 * Math.cos(a))}
                    stroke={major ? "rgba(247,245,240,0.7)" : "rgba(247,245,240,0.25)"}
                    strokeWidth={major ? 1.5 : 1}
                  />
                );
              })}
              <g data-hand>
                <line x1="200" y1="118" x2="200" y2="62" stroke="#f7f5f0" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="200" cy="62" r="4" fill="#3fd8f2" />
              </g>
              <text
                x="200"
                y="214"
                textAnchor="middle"
                fill="#f7f5f0"
                style={{ fontFamily: "var(--font-display)", fontSize: 58, fontWeight: 340, letterSpacing: "-0.03em" }}
              >
                {business.guarantee.hours}
              </text>
              <text
                x="200"
                y="242"
                textAnchor="middle"
                fill="#a9b6cc"
                style={{ fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.22em" }}
              >
                HOURS
              </text>
            </svg>
          </div>

          {/* Copy */}
          <div>
            <p className="eyebrow flex items-center gap-3 text-mist">
              <span className="h-px w-8 bg-current opacity-60" aria-hidden="true" />
              The ScrubHub promise
            </p>
            <h2 id="promise-title" className="display mt-6 text-[clamp(2.5rem,5vw,4.5rem)]">
              If we missed something, <em>we&rsquo;re back within {business.guarantee.hours} hours.</em>
            </h2>
            <p className="lede mt-7 max-w-xl text-porcelain/75">{business.guarantee.body}</p>

            <ul className="mt-10 space-y-2 border-l border-porcelain/15 pl-6">
              {beats.map((b) => (
                <li key={b} data-beat className="display text-[1.625rem] leading-snug md:text-[2rem]">
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Book with confidence <Icon name="arrow" size={16} className="btn-arrow" />
              </Link>
              <a href={business.contact.smsHref} className="btn btn-ghost-light">
                <Icon name="message" size={16} /> Text {business.contact.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
