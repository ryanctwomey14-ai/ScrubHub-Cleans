"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { lockScroll } from "@/lib/motion";
import { primaryNav } from "./nav";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > 480 && y > lastY.current + 4);
      if (y < lastY.current - 4) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    lockScroll(open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-porcelain"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,padding] duration-700 ease-[var(--ease-out-expo)] ${
          hidden && !open ? "-translate-y-[120%]" : "translate-y-0"
        } ${scrolled ? "px-3 pt-3 md:px-5" : "px-0 pt-0"}`}
      >
        <div
          className={`mx-auto flex max-w-[84rem] items-center justify-between transition-all duration-700 ease-[var(--ease-out-expo)] ${
            scrolled
              ? "h-16 rounded-full border border-sand/80 bg-porcelain/95 pl-5 pr-2 shadow-[0_12px_40px_-24px_rgba(15,29,58,0.35)] backdrop-blur-xl md:pl-6"
              : "h-20 border border-transparent px-5 md:h-24 md:px-10 xl:px-14"
          }`}
        >
          <Link
            href="/"
            onClick={() => setOpen(false)}
            aria-label={`${business.name}: home`}
            className="relative z-10 shrink-0"
          >
            <Image
              src="/brand/logo-on-light.png"
              alt={business.name}
              width={929}
              height={338}
              priority
              className={`w-auto transition-all duration-700 ${scrolled ? "h-9" : "h-10 md:h-12"}`}
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9 text-[0.9375rem] font-medium">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="link-draw text-ink/80 transition-colors hover:text-ink aria-[current=page]:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={business.contact.phoneHref}
              className="hidden items-center gap-2.5 rounded-full px-4 py-2.5 text-[0.9375rem] font-semibold text-ink transition-colors hover:bg-ink/5 md:inline-flex"
            >
              <Icon name="phone" size={17} />
              {business.contact.phoneDisplay}
            </a>
            <Link href="/contact" className="btn btn-primary !hidden !h-12 !px-5 md:!inline-flex">
              Get a quote
              <Icon name="arrow" size={16} className="btn-arrow" />
            </Link>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-ink/15 text-ink transition-colors hover:border-ink lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="fixed inset-0 z-40 flex flex-col bg-porcelain px-5 pb-8 pt-28 md:px-10 lg:hidden"
      >
        <nav aria-label="Mobile" className="flex-1">
          <ul className="space-y-1">
            {[{ href: "/", label: "Home" }, ...primaryNav, { href: "/contact", label: "Contact" }].map(
              (item, i) => (
                <li key={item.href} style={{ animation: open ? `menu-in 0.7s ${0.04 * i}s both var(--ease-out-expo)` : undefined }}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="display block py-2 text-[2.5rem] text-ink aria-[current=page]:italic"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="grid gap-3 border-t border-sand pt-6">
          <a href={business.contact.phoneHref} className="btn btn-ink w-full">
            <Icon name="phone" size={17} /> Call {business.contact.phoneDisplay}
          </a>
          <Link href="/contact" onClick={() => setOpen(false)} className="btn btn-primary w-full">
            Get a quote <Icon name="arrow" size={16} className="btn-arrow" />
          </Link>
          <p className="pt-2 text-center text-sm text-stone">{business.hours.label} · Call or text any time</p>
        </div>
        <style>{`@keyframes menu-in{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}`}</style>
      </div>
    </>
  );
}
