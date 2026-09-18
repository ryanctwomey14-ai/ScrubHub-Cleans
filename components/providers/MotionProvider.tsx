"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger, setLenis, prefersReducedMotion, EASE } from "@/lib/motion";

/**
 * Owns smooth scrolling (Lenis) and the site-wide scroll reveals.
 * Any element with `data-reveal` fades up as it enters the viewport;
 * `data-reveal-delay="0.1"` staggers it. Reduced-motion users get none of it.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Lenis + GSAP ticker, once.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.1,
      anchors: { offset: -96 },
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
    });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Scroll reveals, re-bound on every route.
  useEffect(() => {
    const root = document.documentElement;
    if (prefersReducedMotion()) {
      root.classList.remove("motion-ok");
      return;
    }

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      items.forEach((el) => {
        const delay = parseFloat(el.dataset.revealDelay ?? "0");
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 1.1,
          delay,
          ease: EASE,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });
    });

    (window as unknown as { __motionReady?: boolean }).__motionReady = true;
    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [pathname]);

  return <>{children}</>;
}
