"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

// The panel (and its logic) only downloads once a visitor shows interest.
const loadPanel = () => import("./ChatPanel");
const ChatPanel = dynamic(loadPanel, { ssr: false });

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);

  // Lets ".chat-only" buttons elsewhere ("I have a question") appear only when chat exists.
  useEffect(() => {
    document.documentElement.dataset.chat = "on";
    return () => {
      delete document.documentElement.dataset.chat;
    };
  }, []);

  // Arrive quietly after the hero has had its moment.
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1600);
    return () => clearTimeout(t);
  }, []);

  const openPanel = useCallback(() => {
    setMounted(true);
    setOpen(true);
  }, []);

  const closePanel = useCallback(() => {
    setOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  // Step aside while forms and the footer are on screen, so we never cover a submit button or contact details.
  const [yielding, setYielding] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const targets = document.querySelectorAll("[data-chat-avoid]");
    const visible = new Set<Element>();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target)));
        setYielding(visible.size > 0);
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => {
      io.disconnect();
      setYielding(false);
    };
  }, [pathname]);

  // Other parts of the site can open the concierge: dispatch "scrubhub:chat".
  useEffect(() => {
    const handler = () => openPanel();
    window.addEventListener("scrubhub:chat", handler);
    return () => window.removeEventListener("scrubhub:chat", handler);
  }, [openPanel]);

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={openPanel}
        onPointerEnter={() => void loadPanel()}
        onFocus={() => void loadPanel()}
        aria-label="Chat with the ScrubHub concierge"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`on-ink group fixed right-4 z-40 flex items-center gap-3 rounded-full bg-ink p-1.5 text-porcelain shadow-[0_18px_40px_-16px_rgba(15,29,58,0.6)] ring-1 ring-white/10 transition-all duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 md:right-6 md:pr-5 ${
          visible && !open && !yielding ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        } bottom-[calc(5.1rem+env(safe-area-inset-bottom))] md:bottom-6`}
      >
        <span className="relative grid h-11 w-11 place-items-center rounded-full bg-gradient-to-b from-[#1b2d55] to-ink ring-1 ring-glint/30">
          <Image src="/brand/mark.png" alt="" width={300} height={338} className="h-6 w-auto" />
          <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-ink bg-glint" aria-hidden="true" />
        </span>
        <span className="hidden text-left leading-tight md:block">
          <span className="block text-[0.8125rem] font-semibold">Ask our concierge</span>
          <span className="block text-[0.6875rem] text-mist">Answers in seconds · 24/7</span>
        </span>
      </button>

      {mounted && <ChatPanel open={open} onClose={closePanel} />}
    </>
  );
}
