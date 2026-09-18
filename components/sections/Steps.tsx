import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";

const steps = [
  { title: "Get your quote", body: "Call, text, or send the form. It takes under a minute." },
  { title: "We tailor the clean", body: "Your plan is built around your home, priorities, and schedule." },
  {
    title: "Enjoy a spotless home",
    body: `And if anything's missed, we're back within ${business.guarantee.hours} hours to make it right.`,
  },
];

/** Pointy-top hexagon points, matching the logo's container shape. */
function hexPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 6 }, (_, i) => {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

/** Brand backdrop: crisp oversized hex outlines + the S mark as a soft glow. */
function MarkBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2 h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, #1a5fe8 0%, transparent 60%)" }}
      />
      <svg viewBox="0 0 1000 1000" className="absolute left-1/2 top-1/2 h-[150%] min-h-[64rem] -translate-x-1/2 -translate-y-1/2">
        <defs>
          <linearGradient id="hex-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3fd8f2" />
            <stop offset="100%" stopColor="#1a5fe8" />
          </linearGradient>
        </defs>
        <polygon points={hexPoints(500, 500, 470)} fill="none" stroke="url(#hex-stroke)" strokeWidth="3" opacity="0.35" strokeLinejoin="round" />
        <polygon points={hexPoints(500, 500, 400)} fill="none" stroke="url(#hex-stroke)" strokeWidth="1.5" opacity="0.18" strokeLinejoin="round" />
        <polygon points={hexPoints(500, 500, 330)} fill="none" stroke="url(#hex-stroke)" strokeWidth="1" opacity="0.1" strokeLinejoin="round" />
      </svg>
      <Image
        src="/brand/mark.png"
        alt=""
        width={300}
        height={338}
        className="absolute left-1/2 top-1/2 h-[120%] min-h-[48rem] w-auto -translate-x-1/2 -translate-y-1/2 opacity-[0.07] blur-[3px]"
      />
    </div>
  );
}

export function Steps() {
  return (
    <section className="section on-ink relative isolate overflow-hidden bg-night text-white" aria-labelledby="steps-title">
      <MarkBackdrop />
      <div className="shell">
        <div className="text-center">
          <p data-reveal className="eyebrow">How it works</p>
          <h2 id="steps-title" data-reveal className="display h2 mx-auto mt-4 max-w-[18ch]">
            Booked in <em>3 Easy Steps</em>
          </h2>
        </div>

        <ol className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => (
            <li
              key={s.title}
              data-reveal
              data-reveal-delay={String(i * 0.08)}
              className="relative rounded-2xl bg-white p-7 text-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] md:p-8"
            >
              <span className="display text-[3rem] leading-none text-hub/15">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-3 text-[1.375rem] !font-bold">{s.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-stone">{s.body}</p>
            </li>
          ))}
        </ol>

        <div data-reveal className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/contact" className="btn btn-primary">
            Start with a quote <Icon name="arrow" size={16} className="btn-arrow" />
          </Link>
          <a href={business.contact.phoneHref} className="btn btn-ghost-light">
            <Icon name="phone" size={16} /> {business.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}
