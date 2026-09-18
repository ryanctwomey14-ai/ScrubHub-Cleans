import Image from "next/image";
import Link from "next/link";
import { business, cityLabel } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { QuoteCta } from "@/components/quote/QuoteCta";

// Deliberately short: one action, how to reach a human, and a few quiet links.
const links = [
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
];

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

      <div className="shell relative pb-10 pt-16 md:pt-20">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Image src="/brand/logo-on-dark.png" alt={business.name} width={929} height={338} className="h-11 w-auto" />
            <p className="display mt-6 max-w-md text-[1.625rem] leading-[1.15] text-porcelain md:text-[1.875rem]">
              Your price in 60 seconds. <em>Made right,</em> always.
            </p>
            <div className="mt-7">
              <QuoteCta from="footer" />
            </div>
          </div>

          <ul className="grid gap-3 text-[0.9375rem] text-porcelain/80">
            <li>
              <a href={business.contact.phoneHref} className="flex items-center gap-3 hover:text-porcelain">
                <Icon name="phone" size={17} className="text-glint" />
                <span>
                  Call or text <strong className="text-porcelain">{business.contact.phoneDisplay}</strong>
                </span>
              </a>
            </li>
            <li>
              <a href={business.contact.emailHref} className="flex items-center gap-3 break-all hover:text-porcelain">
                <Icon name="message" size={17} className="text-glint" />
                {business.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Icon name="clock" size={17} className="text-glint" />
              {business.hours.label} · Serving {cityLabel}
            </li>
          </ul>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-porcelain/10 pt-7 text-[0.8125rem] text-mist md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {business.legalName}. All rights reserved.
          </p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-porcelain">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
