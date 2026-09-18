import Image from "next/image";
import Link from "next/link";
import { business, cityLabel } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { primaryNav } from "./nav";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-chat-avoid className="on-ink relative overflow-hidden bg-ink text-porcelain">
      {/* soft cyan light from the logo, very restrained */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "radial-gradient(circle, #3fd8f2, transparent 65%)" }}
      />

      <div className="shell relative pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Image
              src="/brand/logo-on-dark.png"
              alt={business.name}
              width={929}
              height={338}
              className="h-12 w-auto"
            />
            <p className="display mt-8 max-w-md text-[1.75rem] leading-[1.15] text-porcelain md:text-[2rem]">
              Tailored to your home. <em>Made right,</em> always.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Get a quote <Icon name="arrow" size={16} className="btn-arrow" />
              </Link>
              <a href={business.contact.smsHref} className="btn btn-ghost-light">
                <Icon name="message" size={17} /> Text us
              </a>
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-7">
            <div>
              <h2 className="eyebrow text-mist">Services</h2>
              <ul className="mt-5 space-y-3 text-[0.9375rem]">
                {business.services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="link-draw text-porcelain/80 hover:text-porcelain">
                      {s.shortName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-mist">Company</h2>
              <ul className="mt-5 space-y-3 text-[0.9375rem]">
                {[...primaryNav.filter((n) => n.href !== "/services"), { href: "/contact", label: "Contact" }].map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="link-draw text-porcelain/80 hover:text-porcelain">
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow text-mist">Reach us</h2>
              <ul className="mt-5 space-y-3 text-[0.9375rem] text-porcelain/80">
                <li>
                  <a href={business.contact.phoneHref} className="link-draw hover:text-porcelain">
                    {business.contact.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a href={business.contact.emailHref} className="link-draw break-all hover:text-porcelain">
                    {business.contact.email}
                  </a>
                </li>
                <li>{business.hours.label}</li>
                <li>Serving {cityLabel}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-porcelain/10 pt-8 text-[0.8125rem] text-mist md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {business.legalName}. All rights reserved.
          </p>
          <p className="flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-glint" aria-hidden="true" />
            {business.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
