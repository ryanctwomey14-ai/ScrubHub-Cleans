"use client";

import Image from "next/image";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { CHAT_LIMITS, LEAD_FORM_TOKEN, QUICK_REPLIES } from "@/lib/chat/config";
import { lockScroll } from "@/lib/motion";
import { submitLead } from "@/lib/submit-lead";

type Msg = { id: string; role: "user" | "assistant"; content: string };

const uid = () => Math.random().toString(36).slice(2, 10);

const GREETING = `Hi, welcome to ${business.name}. I can answer questions about our services, our service area, and our 24-hour make-it-right promise, or help you get a quote. What can I help with?`;

/** Hide the lead token (and any half-streamed piece of it) from display. */
function visibleText(text: string) {
  let t = text.replace(LEAD_FORM_TOKEN, "");
  const partial = t.lastIndexOf("[[");
  if (partial !== -1 && !t.slice(partial).includes("]]")) t = t.slice(0, partial);
  return t.trimEnd();
}

/** Minimal formatting: paragraphs, "- " bullets, and a tappable phone number. */
function RichText({ text }: { text: string }) {
  const phone = business.contact.phoneDisplay;
  const linkify = (line: string) =>
    line.split(phone).map((part, i, arr) => (
      <Fragment key={i}>
        {part}
        {i < arr.length - 1 && (
          <a href={business.contact.phoneHref} className="whitespace-nowrap font-semibold text-glint underline-offset-2 hover:underline">
            {phone}
          </a>
        )}
      </Fragment>
    ));

  return (
    <>
      {text.split(/\n{2,}/).map((block, i) => {
        const lines = block.split("\n");
        if (lines.every((l) => /^\s*[-•]\s/.test(l))) {
          return (
            <ul key={i} className="my-2 space-y-1.5">
              {lines.map((l, j) => (
                <li key={j} className="flex gap-2.5">
                  <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-glint" aria-hidden="true" />
                  <span>{linkify(l.replace(/^\s*[-•]\s/, ""))}</span>
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="[&:not(:first-child)]:mt-2.5">
            {lines.map((l, j) => (
              <Fragment key={j}>
                {j > 0 && <br />}
                {linkify(l)}
              </Fragment>
            ))}
          </p>
        );
      })}
    </>
  );
}

export default function ChatPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Lock the page behind the full-screen mobile panel.
  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    if (open && mobile) lockScroll(true);
    return () => {
      if (mobile) lockScroll(false);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    });
  }, []);

  useEffect(scrollToEnd, [messages, showLeadForm, scrollToEnd]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim().slice(0, CHAT_LIMITS.maxUserMessageLength);
      if (!content || busy) return;

      const history = [...messages, { id: uid(), role: "user" as const, content }];
      const assistantId = uid();
      setMessages([...history, { id: assistantId, role: "assistant", content: "" }]);
      setInput("");
      setBusy(true);

      const update = (value: string) =>
        setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: value } : m)));

      let full = "";
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map(({ role, content }) => ({ role, content: visibleText(content) || content })),
          }),
        });
        if (!res.body) throw new Error("No response body");
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value, { stream: true });
          update(full);
        }
      } catch {
        full = `Sorry, I couldn't connect just now. Please call or text ${business.contact.phoneDisplay} and the team will help right away.`;
        update(full);
      } finally {
        setBusy(false);
        if (full.includes(LEAD_FORM_TOKEN) && !leadDone) setShowLeadForm(true);
      }
    },
    [busy, messages, leadDone],
  );

  const onQuickReply = (q: string) => {
    if (q === "Get a quote") {
      setMessages((prev) => [
        ...prev,
        { id: uid(), role: "user", content: "I'd like a quote." },
        {
          id: uid(),
          role: "assistant",
          content:
            "Wonderful. Share a few details below and the team will put together a quote tailored to your space. Prefer to talk it through? Call or text " +
            business.contact.phoneDisplay +
            ".",
        },
      ]);
      setShowLeadForm(true);
      return;
    }
    void send(q);
  };

  const remaining = CHAT_LIMITS.maxUserMessageLength - input.length;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="false"
      aria-label="ScrubHub concierge chat"
      hidden={!open}
      className="on-ink fixed inset-x-0 top-0 z-50 flex flex-col overflow-hidden bg-ink text-porcelain bottom-[calc(4.3rem+env(safe-area-inset-bottom))] md:inset-auto md:bottom-6 md:right-6 md:h-[min(42rem,calc(100dvh-3rem))] md:w-[25rem] md:rounded-[1.75rem] md:shadow-[0_40px_80px_-30px_rgba(15,29,58,0.7)] md:ring-1 md:ring-white/10"
      style={{ animation: open ? "chat-in 0.6s var(--ease-out-expo) both" : undefined }}
    >
      <style>{`@keyframes chat-in{from{opacity:0;transform:translateY(16px) scale(.985)}to{opacity:1;transform:none}}`}</style>

      {/* Header */}
      <div className="relative flex items-center gap-3 border-b border-white/8 px-5 pb-4 pt-5">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #3fd8f2, transparent 70%)" }}
        />
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/6 ring-1 ring-glint/25">
          <Image src="/brand/mark.png" alt="" width={300} height={338} className="h-6 w-auto" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="display text-[1.25rem] leading-tight">ScrubHub Concierge</p>
          <p className="flex items-center gap-1.5 text-[0.75rem] text-mist">
            <span className="h-1.5 w-1.5 rounded-full bg-glint" aria-hidden="true" /> AI assistant · Available 24/7
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="grid h-10 w-10 place-items-center rounded-full text-porcelain/80 transition-colors hover:bg-white/8 hover:text-porcelain"
        >
          <Icon name="close" size={18} />
        </button>
      </div>

      {/* Conversation */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 text-[0.9375rem] leading-relaxed"
        aria-live="polite"
      >
        <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white/6 px-4 py-3 text-porcelain/90">
          {GREETING}
        </div>

        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK_REPLIES.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => onQuickReply(q)}
                className="rounded-full border border-white/15 px-3.5 py-2 text-[0.8125rem] text-porcelain/90 transition-colors hover:border-glint/60 hover:bg-white/5 hover:text-porcelain"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-md bg-hub px-4 py-3 text-white">
              {m.content}
            </div>
          ) : (
            <div key={m.id} className="max-w-[88%] rounded-2xl rounded-tl-md bg-white/6 px-4 py-3 text-porcelain/90">
              {visibleText(m.content) ? (
                <RichText text={visibleText(m.content)} />
              ) : (
                <span className="flex gap-1 py-1.5" aria-label="Concierge is typing">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-mist"
                      style={{ animation: `chat-dot 1.2s ${i * 0.15}s infinite ease-in-out` }}
                    />
                  ))}
                  <style>{`@keyframes chat-dot{0%,80%,100%{opacity:.25;transform:translateY(0)}40%{opacity:1;transform:translateY(-3px)}}`}</style>
                </span>
              )}
            </div>
          ),
        )}

        {showLeadForm && !leadDone && (
          <ChatLeadForm
            transcript={messages.map(({ role, content }) => ({ role, content: visibleText(content) }))}
            onDone={(name) => {
              setLeadDone(true);
              setShowLeadForm(false);
              setMessages((prev) => [
                ...prev,
                {
                  id: uid(),
                  role: "assistant",
                  content: `Thank you, ${name}. Your details are with the team and they'll reach out soon. If anything's urgent, call or text ${business.contact.phoneDisplay} any time.`,
                },
              ]);
            }}
          />
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-white/8 px-4 pb-4 pt-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
          className="flex items-end gap-2 rounded-2xl bg-white/6 p-1.5 pl-4 ring-1 ring-white/10 focus-within:ring-glint/50"
        >
          <label htmlFor="chat-input" className="sr-only">
            Your message
          </label>
          <textarea
            id="chat-input"
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={CHAT_LIMITS.maxUserMessageLength}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder="Type your question…"
            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent [scrollbar-width:none] py-2.5 text-[0.9375rem] text-porcelain placeholder:text-mist/70 focus:outline-none"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            aria-label="Send message"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-hub text-white transition-opacity disabled:opacity-35"
          >
            <Icon name="send" size={17} />
          </button>
        </form>
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              if (!leadDone) setShowLeadForm(true);
            }}
            className="btn btn-primary !h-10 !px-4 !text-[0.8125rem]"
          >
            {leadDone ? "Request sent" : "Book now"}
            {!leadDone && <Icon name="arrow" size={14} className="btn-arrow" />}
          </button>
          <div className="flex items-center gap-3 text-[0.75rem] text-mist">
            {remaining < 80 && <span aria-live="polite">{remaining} left</span>}
            <a href={business.contact.phoneHref} className="inline-flex items-center gap-1.5 hover:text-porcelain">
              <Icon name="phone" size={14} /> {business.contact.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatLeadForm({
  transcript,
  onDone,
}: {
  transcript: { role: string; content: string }[];
  onDone: (name: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  return (
    <form
      className="space-y-2.5 rounded-2xl bg-porcelain p-4 text-ink"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        setSending(true);
        setError(null);
        const res = await submitLead({ ...data, source: "chat", transcript });
        setSending(false);
        if (res.ok) onDone(String(data.name).split(" ")[0]);
        else setError(res.error ?? "Something went wrong.");
      }}
    >
      <p className="display text-[1.125rem]">Your details</p>
      <p className="text-[0.8125rem] text-stone">The team will follow up with a tailored quote.</p>
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="sr-only" htmlFor="cl-name">Name</label>
      <input id="cl-name" name="name" required autoComplete="name" placeholder="Name" className="field !h-11 !text-[0.9375rem]" />
      <div className="grid grid-cols-2 gap-2.5">
        <label className="sr-only" htmlFor="cl-phone">Phone</label>
        <input id="cl-phone" name="phone" type="tel" autoComplete="tel" placeholder="Phone" className="field !h-11 !text-[0.9375rem]" />
        <label className="sr-only" htmlFor="cl-zip">Zip code</label>
        <input id="cl-zip" name="zip" inputMode="numeric" autoComplete="postal-code" placeholder="Zip" maxLength={10} className="field !h-11 !text-[0.9375rem]" />
      </div>
      <label className="sr-only" htmlFor="cl-email">Email</label>
      <input id="cl-email" name="email" type="email" autoComplete="email" placeholder="Email" className="field !h-11 !text-[0.9375rem]" />
      <label className="sr-only" htmlFor="cl-service">Service</label>
      <select id="cl-service" name="service" defaultValue="" className="field !h-11 !text-[0.9375rem]">
        <option value="" disabled>
          Service needed
        </option>
        {business.services.map((s) => (
          <option key={s.slug} value={s.name}>
            {s.name}
          </option>
        ))}
        <option value="Not sure yet">Not sure yet</option>
      </select>
      {error && (
        <p role="alert" className="text-[0.8125rem] text-[#b42318]">
          {error}
        </p>
      )}
      <button type="submit" disabled={sending} className="btn btn-primary !h-11 w-full !text-[0.875rem]">
        {sending ? "Sending…" : "Send my details"}
      </button>
      <p className="text-center text-[0.6875rem] text-stone">A phone number or email is all we need.</p>
    </form>
  );
}
