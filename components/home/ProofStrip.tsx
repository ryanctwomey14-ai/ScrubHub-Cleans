import { business } from "@/content/business";

export function ProofStrip() {
  const items = [
    { figure: business.rating.value.toFixed(1), unit: "★", label: "Average client rating" },
    { figure: String(business.rating.count), unit: "", label: "Reviews and counting" },
    { figure: String(business.guarantee.hours), unit: "h", label: "Make-it-right promise" },
    { figure: "24/7", unit: "", label: "Call or text, any hour" },
  ];

  return (
    <section aria-label="Why clients trust us" className="pb-4 pt-16 md:pt-24">
      <div className="shell">
        <dl className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={item.label}
              data-reveal
              data-reveal-delay={String(i * 0.07)}
              className={`flex flex-col px-1 lg:px-8 ${i % 2 === 1 ? "border-l border-sand pl-6 md:pl-8" : ""} ${
                i > 0 ? "lg:border-l lg:border-sand" : "lg:pl-0"
              }`}
            >
              <dt className="order-2 mt-2 text-[0.875rem] text-stone">{item.label}</dt>
              <dd className="display order-1 text-[clamp(2.75rem,5vw,4.25rem)] leading-none tracking-[-0.03em]">
                {item.figure}
                {item.unit === "★" && <span className="ml-1 align-top text-[0.42em] text-hub">★</span>}
                {item.unit && item.unit !== "★" && <span className="ml-0.5 text-[0.5em] text-stone">{item.unit}</span>}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
