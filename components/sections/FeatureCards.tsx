import { business } from "@/content/business";
import { Icon } from "@/components/ui/Icon";

/** Four reasons to book, overlapping the hero's bottom edge. The promise card leads. */
export function FeatureCards({ overlap = true }: { overlap?: boolean }) {
  const cards = [
    {
      icon: "badge" as const,
      title: "Top Rated",
      body: `${business.rating.value} stars from ${business.rating.count} reviews.`,
    },
    {
      icon: "sliders" as const,
      title: "Tailored to You",
      body: "No one-size-fits-all. We clean to your home and priorities.",
    },
    {
      icon: "shield" as const,
      title: `${business.guarantee.hours}-Hour Make-It-Right`,
      body: "Missed something? We're back within 24 hours to fix it.",
      featured: true,
    },
    {
      icon: "clock" as const,
      title: "Flexible, 24/7",
      body: "Call or text any time. We work around your schedule.",
    },
  ];

  return (
    <section aria-label="Why clients choose ScrubHub" className={`relative z-10 ${overlap ? "-mt-24" : "pt-16"}`}>
      <div className="shell">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {cards.map((c, i) => (
            <li
              key={c.title}
              data-reveal
              data-reveal-delay={String(i * 0.06)}
              className={`rounded-2xl p-6 md:p-7 ${
                c.featured
                  ? "bg-hub text-white shadow-[0_24px_50px_-24px_rgba(26,95,232,0.8)]"
                  : "bg-white text-ink shadow-[0_24px_50px_-30px_rgba(8,18,38,0.35)]"
              }`}
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-xl ${
                  c.featured ? "bg-white/15 text-white" : "bg-linen text-hub"
                }`}
              >
                <Icon name={c.icon} size={24} />
              </span>
              <h2 className="display mt-5 text-[1.25rem] !font-bold">{c.title}</h2>
              <p className={`mt-2 text-[0.9375rem] leading-relaxed ${c.featured ? "text-white/85" : "text-stone"}`}>
                {c.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
