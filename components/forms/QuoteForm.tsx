"use client";

import { useId, useState } from "react";
import { business } from "@/content/business";
import { Icon, Stars } from "@/components/ui/Icon";
import { submitLead } from "@/lib/submit-lead";

/**
 * The one lead form used everywhere. Short by default (name, phone, service, zip)
 * because every extra field costs conversions; `extended` adds email + notes.
 */
export function QuoteForm({
  title = "Get Your Instant Quote",
  defaultService = "",
  defaultZip = "",
  extended = false,
  className = "",
}: {
  title?: string;
  defaultService?: string;
  defaultZip?: string;
  extended?: boolean;
  className?: string;
}) {
  const id = useId();
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");

  const shell = `rounded-2xl bg-white p-6 text-ink shadow-[0_30px_70px_-30px_rgba(8,18,38,0.55)] md:p-8 ${className}`;

  if (status === "sent") {
    return (
      <div role="status" className={shell}>
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-hub text-white">
          <Icon name="check" size={24} strokeWidth={2.2} />
        </span>
        <h3 className="display mt-5 text-[1.75rem]">
          You&rsquo;re all set{firstName ? `, ${firstName}` : ""}.
        </h3>
        <p className="mt-3 text-stone">
          Your quote request is with our team and we&rsquo;ll be in touch soon. Need us now? We&rsquo;re available 24/7.
        </p>
        <a href={business.contact.phoneHref} className="btn btn-primary mt-6 w-full">
          <Icon name="phone" size={17} /> Call {business.contact.phoneDisplay}
        </a>
      </div>
    );
  }

  return (
    <form
      className={shell}
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        setStatus("sending");
        setError(null);
        const res = await submitLead({ ...data, source: "quote-form" });
        if (res.ok) {
          setFirstName(String(data.name ?? "").trim().split(" ")[0]);
          setStatus("sent");
        } else {
          setStatus("idle");
          setError(res.error ?? "Something went wrong. Please try again.");
        }
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <h2 className="display text-[1.5rem] leading-tight md:text-[1.75rem]">{title}</h2>
      </div>
      <p className="mt-2 flex items-center gap-2 text-[0.875rem] text-stone">
        <Stars className="text-hub" size={13} />
        {business.rating.value} from {business.rating.count} reviews
      </p>

      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="mt-6 grid gap-3">
        <div>
          <label htmlFor={`${id}-name`} className="sr-only">Full name</label>
          <input id={`${id}-name`} name="name" required autoComplete="name" placeholder="Full name" className="field" />
        </div>
        <div>
          <label htmlFor={`${id}-phone`} className="sr-only">Phone number</label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            required={!extended}
            autoComplete="tel"
            placeholder="Phone number"
            className="field"
          />
        </div>
        {extended && (
          <div>
            <label htmlFor={`${id}-email`} className="sr-only">Email</label>
            <input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder="Email (optional)" className="field" />
          </div>
        )}
        <div className="grid grid-cols-[1.4fr_1fr] gap-3">
          <div>
            <label htmlFor={`${id}-service`} className="sr-only">Service</label>
            <select id={`${id}-service`} name="service" defaultValue={defaultService} className="field">
              <option value="">Service</option>
              {business.services.map((s) => (
                <option key={s.slug} value={s.name}>{s.shortName}</option>
              ))}
              <option value="Not sure yet">Not sure yet</option>
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-zip`} className="sr-only">Zip code</label>
            <input
              id={`${id}-zip`}
              name="zip"
              inputMode="numeric"
              autoComplete="postal-code"
              maxLength={10}
              defaultValue={defaultZip}
              placeholder="Zip code"
              className="field"
            />
          </div>
        </div>
        {extended && (
          <div>
            <label htmlFor={`${id}-message`} className="sr-only">Anything we should know?</label>
            <textarea
              id={`${id}-message`}
              name="message"
              maxLength={2000}
              placeholder="Anything we should know? (bedrooms, pets, timing)"
              className="field"
            />
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-[#fdecea] px-4 py-3 text-[0.875rem] text-[#b42318]">
          {error}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className="btn btn-primary mt-5 w-full !h-14 !text-base">
        {status === "sending" ? "Sending…" : "Get My Quote"}
        <Icon name="arrow" size={18} className="btn-arrow" />
      </button>

      <p className="mt-4 text-center text-[0.8125rem] text-stone">
        Prefer to talk?{" "}
        <a href={business.contact.phoneHref} className="font-bold text-ink underline-offset-2 hover:underline">
          Call or text {business.contact.phoneDisplay}
        </a>
      </p>
    </form>
  );
}
