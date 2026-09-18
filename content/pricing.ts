/**
 * ScrubHub Cleans: instant-quote pricing and booking rules.
 * The quote assistant prices ONLY from this file (never from the AI).
 *
 * ⚠ PLACEHOLDER NUMBERS. Replace every price below with real rates, then set
 * `placeholder: false`. While it's true, the assistant shows a "Sample pricing"
 * badge so nobody mistakes these for real prices.
 */

import type { ServiceSlug } from "./business";

export const pricing = {
  placeholder: true,

  /** Home services: price = base + bedrooms × perBedroom + bathrooms × perBathroom. */
  residential: {
    "maintenance-cleaning": { base: 110, perBedroom: 20, perBathroom: 25 },
    "deep-cleaning": { base: 190, perBedroom: 35, perBathroom: 40 },
    "move-in-move-out-cleaning": { base: 230, perBedroom: 40, perBathroom: 45 },
    "airbnb-turnover-cleaning": { base: 85, perBedroom: 20, perBathroom: 20 },
  } satisfies Partial<Record<ServiceSlug, { base: number; perBedroom: number; perBathroom: number }>>,

  /** Commercial: a "starting at" price per visit by size; final price after a walkthrough. */
  commercial: [
    { label: "Under 2,000 sq ft", startingAt: 150 },
    { label: "2,000–5,000 sq ft", startingAt: 250 },
    { label: "5,000–10,000 sq ft", startingAt: 400 },
    { label: "10,000+ sq ft", startingAt: 650 },
  ],

  /** Recurring maintenance discounts (0.1 = 10% off). */
  frequencies: [
    { label: "Weekly", discount: 0.15 },
    { label: "Every 2 weeks", discount: 0.1 },
    { label: "Monthly", discount: 0.05 },
  ],

  /** Quotes show a range around the estimate: estimate × (1 ± spread). */
  spread: 0.08,

  /** Zip codes we serve (prefix match). 152xx = City of Pittsburgh. */
  serviceZipPrefixes: ["150", "151", "152"],
};

export const booking = {
  /** Earliest bookable day, counted from today (1 = tomorrow). */
  leadDays: 1,
  /** How many days ahead customers can pick from. */
  daysAhead: 14,
  /** Days you don't clean: 0 = Sunday … 6 = Saturday. PLACEHOLDER: confirm with the owner. */
  closedWeekdays: [0] as number[],
  /** Arrival windows offered. PLACEHOLDER: confirm with the owner. */
  windows: ["8–10 AM", "10 AM–12 PM", "12–2 PM", "2–4 PM"],
  /** Alert the VA if a quoted visitor goes quiet this long without booking. */
  abandonAfterMs: 3 * 60 * 1000,
};
