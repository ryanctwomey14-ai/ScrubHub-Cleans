"use client";

/** Opens the concierge from anywhere on the site. */
export function OpenChatButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("scrubhub:chat"))}>
      {children}
    </button>
  );
}
