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
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  const close = () => setOpen(false);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-hub focus:px-5 focus:py-3 focus:text-white"
      >
        Skip to content
      </a>

      <header
        className={`on-ink fixed inset-x-0 top-0 z-50 text-white transition-[background-color,box-shadow] duration-300 ${
          scrolled || open ? "bg-night/92 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.6)] backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div
          className={`shell flex items-center justify-between gap-6 transition-[height] duration-300 ${
            scrolled ? "h-[4.5rem]" : "h-20 md:h-24"
          }`}
        >
          <Link href="/" onClick={close} aria-label={`${business.name}: home`} className="shrink-0">
            <Image
              src="/brand/logo-on-dark.png"
              alt={business.name}
              width={929}
              height={338}
              priority
              className="h-10 w-auto md:h-11"
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1 rounded-full bg-white/[0.07] p-1.5 ring-1 ring-white/12 backdrop-blur">
              {[{ href: "/", label: "Home" }, ...primaryNav].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="block rounded-full px-4 py-2 text-[0.875rem] font-semibold text-white/80 transition-colors hover:text-white aria-[current=page]:bg-white aria-[current=page]:text-ink"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={business.contact.phoneHref}
              className="hidden items-center gap-2 text-[0.9375rem] font-bold text-white hover:text-glint xl:inline-flex"
            >
              <Icon name="phone" size={17} />
              {business.contact.phoneDisplay}
            </a>
            <Link href="/contact" className="btn btn-primary !hidden !h-11 !px-5 !text-[0.875rem] md:!inline-flex">
              Get a Quote <Icon name="arrow" size={15} className="btn-arrow" />
            </Link>
            <button
              ref={menuButton}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/15 lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} size={20} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        hidden={!open}
        className="on-ink fixed inset-0 z-40 flex flex-col bg-night px-5 pb-8 pt-28 text-white md:px-8 lg:hidden"
      >
        <nav aria-label="Mobile" className="flex-1">
          <ul className="divide-y divide-white/10">
            {[{ href: "/", label: "Home" }, ...primaryNav, { href: "/contact", label: "Contact" }].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={close}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="display flex items-center justify-between py-4 text-[1.625rem] !font-bold aria-[current=page]:text-glint"
                >
                  {item.label}
                  <Icon name="arrow" size={18} className="opacity-50" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="grid gap-3">
          <Link href="/contact" onClick={close} className="btn btn-primary w-full">
            Get a Quote <Icon name="arrow" size={16} />
          </Link>
          <a href={business.contact.phoneHref} className="btn btn-ghost-light w-full">
            <Icon name="phone" size={17} /> Call {business.contact.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  );
}
