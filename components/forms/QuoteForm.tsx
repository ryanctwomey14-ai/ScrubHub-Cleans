"use client";

import { useState } from "react";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";
import { submitLead } from "@/lib/submit-lead";

const FREQUENCIES = ["One-time", "Weekly", "Every two weeks", "Monthly", "Not sure yet"];
const CONTACT_PREFS = ["Call", "Text", "Email"];

export function QuoteForm({
  defaultService = "",
  defaultZip = "",
  compact = false,
}: {
  defaultService?: string;
  defaultZip?: string;
  compact?: boolean;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");

  if (status === "sent") {
    return (
      <div role="status" className="flex flex-col items-start rounded-[1.75rem] bg-white p-8 md:p-10">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-hub text-white">
          <Icon name="check" size={26} strokeWidth={2} />
        </span>
        <h3 className="display mt-7 text-[2rem] leading-tight md:text-[2.5rem]">
          Thank you{firstName ? `, ${firstName}` : ""}. <em>We&rsquo;re on it.</em>
        </h3>
        <p className="mt-4 max-w-md text-stone">
          Your request is with our team and we&rsquo;ll be in touch soon with a quote tailored to your space. Need us
          sooner? We&rsquo;re available 24/7.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={business.contact.phoneHref} className="btn btn-ink">
            <Icon name="phone" size={16} /> Call {business.contact.phoneDisplay}
          </a>
          <a href={business.contact.smsHref} className="btn btn-ghost">
            <Icon name="message" size={16} /> Text us
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate={false}
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form));
        setStatus("sending");
        setError(null);
        const res = await submitLead({ ...data, source: "quote-form" });
        if (res.ok) {
          setFirstName(String(data.name ?? "").trim().split(" ")[0]);
          setStatus("sent");
        } else {
          setStatus("idle");
          setError(res.error ?? "Something went wrong.");
        }
      }}
      className="rounded-[1.75rem] bg-white p-6 shadow-[0_30px_60px_-40px_rgba(15,29,58,0.35)] md:p-10"
    >
      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="q-name" className="field-label">Your name</label>
          <input id="q-name" name="name" required autoComplete="name" className="field" placeholder="First and last name" />
        </div>
        <div>
          <label htmlFor="q-phone" className="field-label">Phone</label>
          <input id="q-phone" name="phone" type="tel" autoComplete="tel" className="field" placeholder="(412) 555-0123" />
        </div>
        <div>
          <label htmlFor="q-email" className="field-label">Email</label>
          <input id="q-email" name="email" type="email" autoComplete="email" className="field" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="q-service" className="field-label">Service</label>
          <select id="q-service" name="service" defaultValue={defaultService} className="field">
            <option value="">Choose a service</option>
            {business.services.map((s) => (
              <option key={s.slug} value={s.name}>{s.name}</option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
        </div>
        <div>
          <label htmlFor="q-zip" className="field-label">Zip code</label>
          <input id="q-zip" name="zip" inputMode="numeric" autoComplete="postal-code" maxLength={10} defaultValue={defaultZip} className="field" placeholder="152XX" />
        </div>

        {!compact && (
          <div className="md:col-span-2">
            <label htmlFor="q-frequency" className="field-label">How often?</label>
            <select id="q-frequency" name="frequency" defaultValue="" className="field">
              <option value="">Choose one</option>
              {FREQUENCIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        )}

        <fieldset className="md:col-span-2">
          <legend className="field-label">Best way to reach you</legend>
          <div className="flex flex-wrap gap-2">
            {CONTACT_PREFS.map((p, i) => (
              <label key={p} className="cursor-pointer">
                <input type="radio" name="preferredContact" value={p} defaultChecked={i === 0} className="peer sr-only" />
                <span className="inline-flex h-11 items-center rounded-full border border-sand px-5 text-[0.9375rem] font-medium text-stone transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-porcelain peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-hub">
                  {p}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {!compact && (
          <div className="md:col-span-2">
            <label htmlFor="q-message" className="field-label">
              Tell us about your space <span className="font-normal text-stone">(optional)</span>
            </label>
            <textarea
              id="q-message"
              name="message"
              maxLength={2000}
              className="field"
              placeholder="Bedrooms and bathrooms, pets, rooms that need extra attention, timing…"
            />
          </div>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-5 rounded-xl bg-[#fdecea] px-4 py-3 text-[0.9375rem] text-[#b42318]">
          {error}
        </p>
      )}

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.8125rem] text-stone">A phone number or email is all we need.</p>
        <button type="submit" disabled={status === "sending"} className="btn btn-primary w-full sm:w-auto">
          {status === "sending" ? "Sending…" : "Request my quote"}
          <Icon name="arrow" size={16} className="btn-arrow" />
        </button>
      </div>
    </form>
  );
}
