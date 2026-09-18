/**
 * ScrubHub Cleans: instant-quote pricing, offer, and booking rules.
 * The quote assistant prices ONLY from this file (never from the AI).
 *
 * How a home quote is built (mirrors how the owner prices on the phone):
 *   base(service) + bedrooms + bathrooms + square-footage adder
 *   × condition (how dirty)
 *   + add-ons
 *   − recurring discount (maintenance plans only; one-time pays full price)
 *
 * ⚠ DEMO NUMBERS. Replace every price below with the owner's real rates,
 * then set `placeholder: false`. While true, the assistant shows a "Sample" badge.
 */

import type { ServiceSlug } from "./business";

export const pricing = {
  placeholder: true,

  /** "exact" shows one confident price (converts better); "range" shows low–high. */
  display: "exact" as "exact" | "range",
  /** Only used when display = "range": estimate × (1 ± spread). */
  spread: 0.08,

  /** Per-service base, per bedroom, per bathroom. */
  residential: {
    "maintenance-cleaning": { base: 95, perBedroom: 18, perBathroom: 22 },
    "deep-cleaning": { base: 170, perBedroom: 30, perBathroom: 35 },
    "move-in-move-out-cleaning": { base: 210, perBedroom: 35, perBathroom: 40 },
    "airbnb-turnover-cleaning": { base: 80, perBedroom: 18, perBathroom: 18 },
  } satisfies Partial<Record<ServiceSlug, { base: number; perBedroom: number; perBathroom: number }>>,

  /** Square-footage adders (flat dollars on top of the bed/bath price). */
  sqftTiers: [
    { label: "Under 1,000", add: 0 },
    { label: "1,000–1,500", add: 20 },
    { label: "1,500–2,000", add: 40 },
    { label: "2,000–2,500", add: 65 },
    { label: "2,500–3,500", add: 95 },
    { label: "3,500+", add: 140 },
  ],

  /** Condition multipliers applied to the base clean (not to add-ons). */
  conditions: [
    { id: "tidy", label: "Pretty clean", detail: "Tidy, cleaned in the last few weeks", multiplier: 1 },
    { id: "lived-in", label: "Lived-in", detail: "Normal dust, some kitchen and bath grime", multiplier: 1.1 },
    { id: "overdue", label: "Overdue", detail: "It's been a couple of months", multiplier: 1.25 },
    { id: "heavy", label: "Needs serious love", detail: "Heavy buildup, pets, or first clean in ages", multiplier: 1.45 },
  ],

  /** Add-ons: flat prices added after the condition adjustment. */
  addOns: [
    { id: "oven", label: "Inside oven", price: 35 },
    { id: "fridge", label: "Inside fridge", price: 35 },
    { id: "cabinets", label: "Inside cabinets", price: 45 },
    { id: "windows", label: "Interior windows", price: 40 },
    { id: "baseboards", label: "Hand-wiped baseboards", price: 30 },
    { id: "blinds", label: "Blinds", price: 30 },
    { id: "walls", label: "Wall spot-cleaning", price: 30 },
    { id: "laundry", label: "Laundry (wash & fold)", price: 25 },
    { id: "pet-hair", label: "Pet hair treatment", price: 25 },
  ],

  /** Maintenance frequency. One-time pays full price; recurring gets the discount every visit. */
  frequencies: [
    { label: "One-time", discount: 0 },
    { label: "Weekly", discount: 0.15 },
    { label: "Every 2 weeks", discount: 0.1 },
    { label: "Monthly", discount: 0.05 },
  ],
  /** Tagged "Recommended" in the assistant (our honest suggestion, not a popularity claim). */
  recommendedFrequency: "Every 2 weeks",

  /** Commercial: a "starting at" price per visit by size; final price after a walkthrough. */
  commercial: [
    { label: "Under 2,000 sq ft", startingAt: 150 },
    { label: "2,000–5,000 sq ft", startingAt: 250 },
    { label: "5,000–10,000 sq ft", startingAt: 400 },
    { label: "10,000+ sq ft", startingAt: 650 },
  ],

  /** Zip codes we serve (prefix match). 152xx = City of Pittsburgh. */
  serviceZipPrefixes: ["150", "151", "152"],
};

/**
 * The offer shown with every price (Hormozi: stack value, reverse risk, give a
 * real reason to act now). ⚠ DEMO: the owner must approve both lines.
 */
export const offer = {
  placeholder: true,
  /** Bonus for booking online. Set to null to hide. */
  bonus: "Free inside-fridge clean on your first visit when you book online" as string | null,
  /** Short form of the bonus for the hero offer line. */
  bonusShort: "Free fridge clean when you book online" as string | null,
  /** How long a quoted price is held. Also sets how long the texted resume link works. */
  priceLockDays: 7,
  /** Payment promise shown at the card step. ⚠ Must match the owner's real policy. */
  payment: "You're only charged after the job is done and you're happy with it.",
};

export const booking = {
  /** Earliest bookable day, counted from today (1 = tomorrow). */
  leadDays: 1,
  /** How many days ahead customers can pick from. */
  daysAhead: 14,
  /** Dates shown before "More dates" (fewer choices = faster decisions). */
  daysShown: 5,
  /** Days you don't clean: 0 = Sunday … 6 = Saturday. ⚠ DEMO: confirm with the owner. */
  closedWeekdays: [0] as number[],
  /** Arrival windows offered. ⚠ DEMO: confirm with the owner. */
  windows: ["8–10 AM", "10 AM–12 PM", "12–2 PM", "2–4 PM"],
  /** Alert the VA if a quoted visitor goes quiet this long without booking. */
  abandonAfterMs: 3 * 60 * 1000,
};

/**
 * SMS consent shown under the contact fields (TCPA). ⚠ Have the owner's
 * attorney confirm this wording before launch.
 */
export const smsConsent =
  "By tapping, you agree to receive texts and emails from ScrubHub Cleans about your quote and booking. Msg & data rates may apply. Reply STOP to opt out.";
