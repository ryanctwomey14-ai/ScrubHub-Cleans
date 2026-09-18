/**
 * ScrubHub Cleans: the single source of truth for every business fact.
 * Every page, the structured data, and the chatbot read from this file.
 * Never hardcode a phone number, price, stat, or promise anywhere else.
 *
 * Items marked DRAFT are written copy that still needs owner confirmation.
 * Items marked PLACEHOLDER must be replaced before launch.
 */

export type ServiceSlug =
  | "maintenance-cleaning"
  | "deep-cleaning"
  | "move-in-move-out-cleaning"
  | "airbnb-turnover-cleaning"
  | "commercial-cleaning";

export interface Service {
  slug: ServiceSlug;
  name: string;
  shortName: string;
  /** One line used in lists and cards. */
  summary: string;
  /** Opening paragraph on the service page. */
  intro: string;
  /** DRAFT: typical focus areas. Confirm with the owner. */
  focus: string[];
  /** Who this service is right for. */
  idealFor: string[];
  /** PLACEHOLDER: null renders as "Custom quote". Set a number to show "From $X". */
  startingPrice: number | null;
  /** Exact photo the client should shoot for this service. */
  photoBrief: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  context: string;
  /** true until replaced with a real, attributable customer review. */
  placeholder: boolean;
}

export interface Faq {
  question: string;
  answer: string;
}

const phoneDigits = "4128662510";

export const business = {
  name: "ScrubHub Cleans",
  legalName: "ScrubHub Cleans LLC",
  tagline: "We Will Make It Right... ALWAYS",
  description:
    "Premium home and commercial cleaning in Pittsburgh, PA. Every clean is tailored to your space, and if we miss something, we're back within 24 hours to make it right.",

  /** Set NEXT_PUBLIC_SITE_URL in production (e.g. https://scrubhubcleansllc.com). */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    phoneDisplay: "412-866-2510",
    phoneHref: `tel:+1${phoneDigits}`,
    smsHref: `sms:+1${phoneDigits}`,
    phoneE164: `+1${phoneDigits}`,
    email: "support@scrubhubcleansllc.com",
    emailHref: "mailto:support@scrubhubcleansllc.com",
  },

  hours: {
    label: "Open 24/7",
    detail: "Call, text, or request a quote any time, day or night.",
    /** schema.org openingHours format */
    schema: "Mo-Su 00:00-23:59",
  },

  /**
   * The client brief says "Pittsburg, PA". The 412 area code is Pittsburgh, PA.
   * Using "Pittsburgh" until the owner confirms. Change it here only.
   */
  location: {
    city: "Pittsburgh",
    region: "PA",
    regionName: "Pennsylvania",
    country: "US",
  },
  serviceAreas: ["Pittsburgh, PA"],

  rating: {
    value: 4.8,
    count: 160,
  },

  guarantee: {
    hours: 24,
    headline: "If we missed something, we're back within 24 hours.",
    body:
      "Walk through when we're done. If anything isn't right, tell us, and we'll come back within 24 hours to fix it. We will make it right. Always.",
  },

  booking: {
    methods: ["Call", "Text", "Quote form"],
    summary: "Call, text, or fill out the quote form, whichever is easiest for you.",
  },

  differentiators: [
    {
      title: "You come first",
      body:
        "We put your needs ahead of our schedule, and it shows: there's a reason our clients stay with us for so long.",
    },
    {
      title: "Built around you",
      body:
        "We adapt every clean to your space, your routine, and what you care about most, because no two homes are alike.",
    },
    {
      title: "Made right, always",
      body:
        "If we missed something, we come back within 24 hours to fix it. It's the promise our business is built on.",
    },
  ],

  /** Short proof points used in strips and badges. */
  proofPoints: ["Top Rated", "Flexible", "We Will Make It Right... ALWAYS"],

  services: [
    {
      slug: "maintenance-cleaning",
      name: "Maintenance Cleaning",
      shortName: "Maintenance",
      summary: "Recurring visits that keep your home consistently, quietly cared for.",
      intro:
        "A standing clean on the schedule that suits you, whether that's weekly, every other week, or monthly. We learn your home, remember your preferences, and keep it at the standard you expect without you having to ask twice.",
      focus: [
        "Kitchens: counters, fronts, sinks, and appliance exteriors",
        "Bathrooms cleaned and sanitized top to bottom",
        "Dusting of reachable surfaces, ledges, and fixtures",
        "Floors vacuumed and mopped throughout",
        "Beds made and living spaces reset",
        "Your own priority list, adjusted visit to visit",
      ],
      idealFor: [
        "Busy households that want their weekends back",
        "Anyone who wants the same trusted team every time",
        "Homes that need consistency more than a one-off rescue",
      ],
      startingPrice: null,
      photoBrief:
        "Sunlit kitchen, freshly finished: clear counters, a single bowl of lemons, soft morning light. No people, no cleaning tools.",
      seoTitle: "Recurring House Cleaning in Pittsburgh",
      seoDescription:
        "Weekly, bi-weekly, or monthly house cleaning in Pittsburgh, tailored to your home. Rated 4.8 stars, with a 24-hour make-it-right promise.",
    },
    {
      slug: "deep-cleaning",
      name: "Deep Cleaning",
      shortName: "Deep Clean",
      summary: "A top-to-bottom reset for the corners everyday cleaning never reaches.",
      intro:
        "When your home needs more than upkeep. A deep clean goes past the surfaces into the details: built-up grime, baseboards, fixtures, and the spots that quietly collect dust. It's the right first visit before recurring service, or a seasonal reset.",
      focus: [
        "Baseboards, door frames, and trim wiped down",
        "Built-up grime lifted from kitchens and bathrooms",
        "Detailed dusting of fixtures, vents, and hard-to-reach ledges",
        "Behind and beneath movable furniture",
        "Cabinet fronts, handles, and switch plates",
        "Everything in a maintenance clean, done in depth",
      ],
      idealFor: [
        "First-time clients starting recurring service",
        "Seasonal resets and pre-holiday preparation",
        "Homes that haven't had professional care in a while",
      ],
      startingPrice: null,
      photoBrief:
        "Close, low-angle shot of a spotless bathroom vanity: polished faucet, folded white towel, natural light. No products or tools in frame.",
      seoTitle: "Deep Cleaning Services in Pittsburgh",
      seoDescription:
        "Top-to-bottom deep cleaning in Pittsburgh for baseboards, fixtures, built-up grime, and every overlooked corner. Backed by our 24-hour make-it-right promise.",
    },
    {
      slug: "move-in-move-out-cleaning",
      name: "Move-In / Move-Out Cleaning",
      shortName: "Move-In / Out",
      summary: "An empty home, cleaned to hand-over standard, for keys, deposits, and fresh starts.",
      intro:
        "Moving is chaotic enough. We clean the empty space inside and out, so you can hand over the keys with confidence or unpack into a home that already feels like yours.",
      focus: [
        "Inside cabinets, drawers, and closets",
        "Appliances inside and out, where accessible",
        "Bathrooms and kitchens detailed for inspection",
        "Baseboards, doors, frames, and switch plates",
        "Floors cleaned edge to edge in every room",
        "Timed around your move-out or move-in date",
      ],
      idealFor: [
        "Tenants protecting a security deposit",
        "Homeowners preparing a property for sale",
        "Landlords and property managers between tenants",
      ],
      startingPrice: null,
      photoBrief:
        "Empty, bright room with bare hardwood floors and afternoon light through a window. Keys resting on a clean windowsill.",
      seoTitle: "Move-In & Move-Out Cleaning in Pittsburgh",
      seoDescription:
        "Move-in and move-out cleaning in Pittsburgh for tenants, owners, and landlords. Empty-home detail cleaning timed to your move date.",
    },
    {
      slug: "airbnb-turnover-cleaning",
      name: "Airbnb Turnover Cleaning",
      shortName: "Airbnb Turnovers",
      summary: "Guest-ready turnovers between stays, timed to your check-outs and check-ins.",
      intro:
        "Your reviews depend on the first five minutes a guest spends in the space. We turn your rental around between stays, resetting it to the same five-star standard every time, on your booking calendar.",
      focus: [
        "Full reset of kitchens, bathrooms, and living areas",
        "Beds made and linens changed (supplied by host)",
        "Staging to your listing photos and house guide",
        "Restocking guest essentials from your supply",
        "A heads-up on damage or anything left behind",
        "Scheduling that follows your booking calendar",
      ],
      idealFor: [
        "Short-term rental hosts and co-hosts",
        "Owners managing multiple listings",
        "Hosts who want consistent, review-proof turnovers",
      ],
      startingPrice: null,
      photoBrief:
        "Styled guest bedroom: crisp white bedding, folded towels at the foot of the bed, a small welcome card on the nightstand.",
      seoTitle: "Airbnb Turnover Cleaning in Pittsburgh",
      seoDescription:
        "Reliable Airbnb and short-term rental turnover cleaning in Pittsburgh. Guest-ready resets timed to your check-outs and check-ins.",
    },
    {
      slug: "commercial-cleaning",
      name: "Commercial Cleaning",
      shortName: "Commercial",
      summary: "Offices and workspaces kept sharp for your team and your clients.",
      intro:
        "First impressions happen at the front door. We keep offices and commercial spaces spotless on a schedule that works around your business hours, so your team walks into a clean space every morning.",
      focus: [
        "Workstations, common areas, and reception",
        "Restrooms cleaned and sanitized",
        "Break rooms and kitchenettes",
        "Floors vacuumed and mopped throughout",
        "Trash and recycling handled",
        "After-hours scheduling around your operations",
      ],
      idealFor: [
        "Small and mid-sized offices",
        "Client-facing studios, showrooms, and suites",
        "Businesses that need after-hours or flexible service",
      ],
      startingPrice: null,
      photoBrief:
        "Wide shot of a bright, empty office at golden hour: clean desks, chairs pushed in, city view through windows.",
      seoTitle: "Commercial & Office Cleaning in Pittsburgh",
      seoDescription:
        "Commercial and office cleaning in Pittsburgh on a schedule built around your business hours. Flexible, accountable, and rated 4.8 stars.",
    },
  ] satisfies Service[],

  /** PLACEHOLDER testimonials. Replace with real, attributable reviews before launch. */
  testimonials: [
    {
      quote:
        "They asked how we actually live in our house before they cleaned a single room. Six months in, it still feels like the first visit.",
      name: "Placeholder Client",
      context: "Maintenance clients",
      placeholder: true,
    },
    {
      quote:
        "I pointed out one missed spot on the stairs. They were back the next morning, apologized, and fixed it. That's why we stay.",
      name: "Placeholder Client",
      context: "Deep clean",
      placeholder: true,
    },
    {
      quote:
        "Our guests comment on how clean the place is in almost every review now. Turnovers are the one thing I don't worry about.",
      name: "Placeholder Host",
      context: "Airbnb turnovers",
      placeholder: true,
    },
  ] satisfies Testimonial[],

  faqs: [
    {
      question: "How do I get a quote?",
      answer:
        "Whatever's easiest for you: call or text 412-866-2510, or fill out our quote form. Tell us a little about your space and what you need, and we'll take it from there.",
    },
    {
      question: "What happens if something gets missed?",
      answer:
        "Tell us. If we missed something, we'll come back within 24 hours to make it right. It's the promise our business is built on.",
    },
    {
      question: "Is every clean the same?",
      answer:
        "No, and that's the point. There's no such thing as one-size-fits-all. We tailor each clean to your space, your priorities, and your schedule.",
    },
    {
      question: "When can I reach you?",
      answer:
        "Any time. We're available 24/7 by phone and text, and you can request a quote online whenever it suits you.",
    },
    {
      question: "Which areas do you serve?",
      answer:
        "We serve Pittsburgh, PA. If you're nearby and not sure whether you're covered, call or text us your zip code and we'll let you know.",
    },
    {
      question: "What kinds of cleaning do you offer?",
      answer:
        "Maintenance (recurring) cleaning, deep cleaning, move-in and move-out cleaning, Airbnb turnovers, and commercial cleaning.",
    },
  ] satisfies Faq[],
};

export type Business = typeof business;

export function getService(slug: string): Service | undefined {
  return business.services.find((s) => s.slug === slug);
}

export function formatPrice(price: number | null): string {
  return price === null ? "Custom quote" : `From $${price}`;
}

export const cityLabel = `${business.location.city}, ${business.location.region}`;
