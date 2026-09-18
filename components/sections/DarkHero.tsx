import Image from "next/image";
import Link from "next/link";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";

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
  image,
  banner,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  photoBrief: string;
  /** Real background photo; replaces the navy placeholder. */
  image?: { src: string; alt: string };
  /** Shown above the eyebrow and headline (e.g. the Google reviews banner). */
  banner?: React.ReactNode;
  form?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
  size?: "home" | "page";
  children?: React.ReactNode;
}) {
  const home = size === "home";

  return (
    <section className="on-ink grain relative isolate overflow-hidden bg-night text-white">
      {image ? (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            priority
            quality={90}
            sizes="100vw"
            className="-z-10 object-cover object-center"
          />
          {/* Legibility: darker behind the headline (left), lighter so the clean side reads bright (right) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-r from-night/95 from-15% via-night/80 via-50% to-night/20 max-lg:bg-night/80"
          />
          <div aria-hidden="true" className="absolute inset-x-0 top-0 -z-10 h-36 bg-gradient-to-b from-night/75 to-transparent" />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-night/80 to-transparent" />
        </>
      ) : (
        <>
          {/* Photo stand-in until a real photo is supplied */}
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
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/20" />
        </>
      )}

      <div
        className={`shell relative grid gap-y-8 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-6 ${
          home ? "pb-32 pt-28 md:pt-36 lg:pb-32 lg:pt-36" : "pb-16 pt-32 md:pb-20 md:pt-40"
        }`}
      >
        {/* Mobile order: headline → quote assistant → supporting copy, so the
            first tap is above the fold. Desktop: copy left, assistant right. */}
        <div className={`${form ? "lg:col-span-7" : "lg:col-span-9"} lg:row-start-1 lg:self-end`}>
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

          {banner && (
            <div data-reveal className="mb-6">
              {banner}
            </div>
          )}
          <p data-reveal className="eyebrow">{eyebrow}</p>
          <h1
            data-reveal
            data-reveal-delay="0.05"
            className={`display mt-5 ${home ? "text-[clamp(2.5rem,4.4vw,4rem)]" : "text-[clamp(2.5rem,5vw,4.25rem)]"}`}
          >
            {title}
          </h1>
        </div>

        {form && (
          <div
            data-reveal
            data-reveal-delay="0.1"
            data-chat-avoid
            id="quote"
            className="scroll-mt-24 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:self-center"
          >
            {form}
          </div>
        )}

        <div className={`${form ? "lg:col-span-7" : "lg:col-span-9"} lg:row-start-2 lg:self-start`}>
          {lede && (
            <p data-reveal data-reveal-delay="0.1" className="lede max-w-xl text-white/75 lg:mt-0">
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
                  <Icon name="shield" size={19} className="text-glint" />
                  <span>
                    <strong className="font-bold">{business.stats.homesCleaned} homes cleaned</strong>
                    <span className="text-white/70"> · every one guaranteed</span>
                  </span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {!image && (
        <p className={`absolute right-4 hidden max-w-xs bottom-3 text-right text-[0.6875rem] leading-snug text-white/35 lg:block`}>
          Photo to shoot: {photoBrief}
        </p>
      )}
    </section>
  );
}
