import Link from "next/link";
import { Eyebrow } from "@/components/ui/SectionIntro";

export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 md:pb-24 md:pt-48">
      <div
        aria-hidden="true"
        className="absolute -right-24 top-0 hidden h-[30rem] w-[30rem] rounded-bl-[6rem] bg-linen md:block"
      />
      <div className="shell relative">
        {crumbs && (
          <nav aria-label="Breadcrumb" data-reveal className="mb-10 text-[0.8125rem] text-stone">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="link-draw hover:text-ink">Home</Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-ink">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="link-draw hover:text-ink">{c.label}</Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div data-reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
        <h1
          data-reveal
          data-reveal-delay="0.06"
          className="display mt-7 max-w-[15ch] text-[clamp(3rem,7vw,6.25rem)] leading-[0.98] tracking-[-0.03em]"
        >
          {title}
        </h1>
        {lede && (
          <p data-reveal data-reveal-delay="0.12" className="lede mt-8 max-w-2xl text-stone">
            {lede}
          </p>
        )}
        {children && (
          <div data-reveal data-reveal-delay="0.16" className="mt-10">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
