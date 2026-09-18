import Link from "next/link";
import { business } from "@/content/business";
import { Icon, Stars } from "@/components/ui/Icon";

/**
 * Dark photo hero with the quote form built in. Used on every page so the
 * visitor can convert without scrolling. `photoBrief` describes the image to
 * shoot; until it exists, a styled navy "photo" stands in.
 */
export function DarkHero({
  eyebrow,
  title,
  lede,
  photoBrief,
  form,
  crumbs,
  size = "page",
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  photoBrief: string;
  form?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
  size?: "home" | "page";
  children?: React.ReactNode;
}) {
  const home = size === "home";

  return (
    <section className="on-ink grain relative isolate overflow-hidden bg-night text-white">
      {/* Photo stand-in: replace with <Image fill className="object-cover" /> once shot */}
      <div
        role="img"
        aria-label={`Placeholder photo: ${photoBrief}`}
        className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,#0b1733_0%,#13264c_45%,#1d3a6b_100%)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "repeating-linear-gradient(105deg, #fff 0 1px, transparent 1px 16%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #3fd8f2, transparent 62%)" }}
        />
      </div>
      {/* legibility scrim, as it would sit over a real photo */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/20" />

      <div
        className={`shell relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12 ${
          home ? "pb-36 pt-32 md:pt-40 lg:pb-44 lg:pt-44" : "pb-16 pt-32 md:pb-20 md:pt-40"
        }`}
      >
        <div className={form ? "lg:col-span-7" : "lg:col-span-9"}>
          {crumbs && (
            <nav aria-label="Breadcrumb" className="mb-6 text-[0.8125rem] text-mist">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-white">Home</Link>
                </li>
                {crumbs.map((c, i) => (
                  <li key={c.href} className="flex items-center gap-2">
                    <span aria-hidden="true">/</span>
                    {i === crumbs.length - 1 ? (
                      <span aria-current="page" className="text-white">{c.label}</span>
                    ) : (
                      <Link href={c.href} className="hover:text-white">{c.label}</Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <p data-reveal className="eyebrow">{eyebrow}</p>
          <h1
            data-reveal
            data-reveal-delay="0.05"
            className={`display mt-5 ${home ? "text-[clamp(2.75rem,5.1vw,4.5rem)]" : "text-[clamp(2.5rem,5vw,4.25rem)]"}`}
          >
            {title}
          </h1>
          {lede && (
            <p data-reveal data-reveal-delay="0.1" className="lede mt-6 max-w-xl text-white/75">
              {lede}
            </p>
          )}

          <div data-reveal data-reveal-delay="0.15" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            {children ?? (
              <>
                <a href={business.contact.phoneHref} className="group flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/20 transition-colors group-hover:bg-hub">
                    <Icon name="phone" size={19} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-mist">
                      Call or text · 24/7
                    </span>
                    <span className="display block text-[1.25rem] !font-bold">{business.contact.phoneDisplay}</span>
                  </span>
                </a>
                <span className="hidden h-10 w-px bg-white/15 sm:block" aria-hidden="true" />
                <span className="flex items-center gap-2.5 text-[0.9375rem]">
                  <Stars className="text-glint" size={15} />
                  <span>
                    <strong className="font-bold">{business.rating.value}</strong>
                    <span className="text-white/70"> · {business.rating.count} reviews</span>
                  </span>
                </span>
              </>
            )}
          </div>
        </div>

        {form && (
          <div data-reveal data-reveal-delay="0.1" data-chat-avoid id="quote" className="scroll-mt-28 lg:col-span-5">
            {form}
          </div>
        )}
      </div>

      <p className={`absolute right-4 hidden max-w-xs ${home ? "bottom-28" : "bottom-3"} text-right text-[0.6875rem] leading-snug text-white/35 lg:block`}>
        Photo to shoot: {photoBrief}
      </p>
    </section>
  );
}
