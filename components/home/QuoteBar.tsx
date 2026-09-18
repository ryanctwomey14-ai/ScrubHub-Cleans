"use client";

import { useRouter } from "next/navigation";
import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";

/** The slim "instant quote" bar that bridges the hero and the page below. */
export function QuoteBar() {
  const router = useRouter();

  return (
    <form
      aria-label="Start your quote"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const params = new URLSearchParams();
        const service = String(data.get("service") ?? "");
        const zip = String(data.get("zip") ?? "").trim();
        if (service) params.set("service", service);
        if (zip) params.set("zip", zip);
        router.push(`/contact${params.size ? `?${params}` : ""}#quote`);
      }}
      className="grid gap-2 rounded-[1.75rem] border border-sand/70 bg-white p-2 shadow-[0_40px_80px_-48px_rgba(15,29,58,0.5)] md:grid-cols-[auto_1.3fr_1fr_auto] md:items-center md:rounded-full"
    >
      <p className="hidden pl-6 pr-2 md:block">
        <span className="display block text-[1.25rem] leading-none">Your quote</span>
        <span className="text-[0.75rem] text-stone">Takes under a minute</span>
      </p>
      <div className="relative md:border-l md:border-sand">
        <label htmlFor="bar-service" className="sr-only">Service</label>
        <select
          id="bar-service"
          name="service"
          defaultValue=""
          className="field !h-14 !rounded-full !border-transparent !bg-porcelain md:!bg-transparent"
        >
          <option value="">What do you need cleaned?</option>
          {business.services.map((s) => (
            <option key={s.slug} value={s.name}>{s.name}</option>
          ))}
        </select>
      </div>
      <div className="relative md:border-l md:border-sand">
        <label htmlFor="bar-zip" className="sr-only">Zip code</label>
        <Icon name="pin" size={17} className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-stone" />
        <input
          id="bar-zip"
          name="zip"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={10}
          placeholder="Zip code"
          className="field !h-14 !rounded-full !border-transparent !bg-porcelain !pl-12 md:!bg-transparent"
        />
      </div>
      <button type="submit" className="btn btn-primary !h-14 !px-8">
        Get my quote <Icon name="arrow" size={16} className="btn-arrow" />
      </button>
    </form>
  );
}
