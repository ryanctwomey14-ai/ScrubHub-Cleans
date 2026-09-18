"use client";

import { useRouter } from "next/navigation";
import type { ServiceSlug } from "@/content/business";
import { ServiceCard } from "@/components/ui/service-card";
import { startQuoteFor } from "@/lib/quote-store";
import { scrollToQuote } from "@/lib/scroll-to-quote";

/** A service card wired to the quote assistant. */
export function ServiceTile(props: {
  slug: ServiceSlug;
  name: string;
  subtitle: string;
  overview: string;
  photoBrief: string;
  image?: string;
  /** Home: short card with no link off the page. */
  compact?: boolean;
}) {
  const router = useRouter();

  const book = () => {
    startQuoteFor(props.slug);
    if (!scrollToQuote()) router.push(`/services/${props.slug}#quote`);
  };

  return (
    <ServiceCard
      imageUrl={props.image}
      imageAlt={`${props.name} by ScrubHub Cleans`}
      photoBrief={props.photoBrief}
      title={props.name}
      href={props.compact ? undefined : `/services/${props.slug}`}
      compact={props.compact}
      subtitle={props.subtitle}
      overview={props.overview}
      onBookNow={book}
    />
  );
}
