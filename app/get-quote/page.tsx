import type { Metadata } from "next";
import { business, cityLabel } from "@/content/business";
import { HomeLanding } from "@/components/sections/HomeLanding";

/**
 * Paid-traffic landing page (Google / Facebook ads). Same page as home, but the
 * header and footer drop all navigation (see `landingPaths` in components/layout/nav.ts).
 * Kept out of search results so it never competes with the homepage.
 */
export const metadata: Metadata = {
  title: "Your Cleaning Price in 60 Seconds",
  description: `See your exact cleaning price in about 60 seconds and grab the next open spot. ${business.stats.homesCleanedPhrase} ${cityLabel} homes cleaned, every one guaranteed.`,
  robots: { index: false, follow: false },
  alternates: { canonical: "/" },
};

export default function GetQuotePage() {
  return <HomeLanding />;
}
