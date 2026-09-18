"use client";

import { getLenis } from "@/lib/motion";

/** Scroll to the quote assistant on this page. Returns false if there isn't one. */
export function scrollToQuote(): boolean {
  const el = document.getElementById("quote");
  if (!el) return false;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(el, { offset: -88, duration: 1.1 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}
