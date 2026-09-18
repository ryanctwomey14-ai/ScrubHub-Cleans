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
  /** Path to the real photo in /public (e.g. "/photos/deep-cleaning.jpg"). Until set, a labeled placeholder shows. */
  image?: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Review {
  /** Pull quote, taken word for word from the review. */
  title: string;
  text: string;
  name: string;
  featured: boolean;
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
  /**
   * SAMPLE LIST: common Pittsburgh-area neighborhoods, used on the homepage and
   * the Service Area page. Replace with the owner's real coverage, then set
   * `neighborhoodsConfirmed: true` to remove the "Sample list" tag.
   */
  neighborhoods: [
    "Shadyside",
    "Squirrel Hill",
    "Lawrenceville",
    "Mt. Lebanon",
    "Upper St. Clair",
    "Bethel Park",
    "Fox Chapel",
    "Sewickley",
    "Wexford",
    "Cranberry Twp",
    "Moon Twp",
    "Monroeville",
  ],
  neighborhoodsConfirmed: false,

  rating: {
    value: 4.8,
    count: 160,
  },

  /** Proof numbers used in headlines. */
  stats: {
    homesCleaned: "1,000+",
    homesCleanedPhrase: "Over 1,000",
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

  services: ([
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
      image: "/photos/maintenance-cleaning.jpg",
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
      image: "/photos/deep-cleaning.jpg",
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
      image: "/photos/move-in-move-out-cleaning.jpg",
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
      image: "/photos/airbnb-turnover-cleaning.jpg",
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
  ] satisfies Service[]) as Service[],

  /**
   * Real client reviews, word for word as written by the client. The first
   * line is the pull quote shown in bold. `featured` reviews appear in the
   * three-card reviews section; all of them appear in the scrolling loop and on
   * /reviews. Set `reviewsUrl` to the Google Business Profile reviews link to
   * make the review headers clickable.
   */
  reviewsUrl: null as string | null,
  reviewsSource: "Google",
  reviews: [
    {
      title: "Their attention to detail and professional approach stood out to me!",
      text: "Scrubhub Cleans LLC did an excellent job cleaning my house. Their attention to detail and professional approach stood out to me, and my area has never been cleaner. Andy and Luke were on time, pleasant, and took additional care with delicate surfaces. I strongly recommend Scrubhub Cleans LLC to anyone searching for a dependable and excellent cleaning service.",
      name: "Tristan McDannell",
      featured: true,
    },
    {
      title: "I would highly suggest trying them out if you're looking for this type of service!",
      text: "The young gentleman that came to my house were very polite, Clean, not intrusive at all. I have four children, and they even dealt very well with my children trying to chase them around while they're cleaning. They did everything that I ask to my standard, which is very high and did it with efficiency! Not to mention, they didn't even have time on their schedule, For when I needed my house clean, but they made it work and they did a really good job. I'm very happy and I would highly suggest trying them out if you're looking for this type of service!!!",
      name: "Jayne Rice",
      featured: true,
    },
    {
      title: "ScrubHub cleans is one of the best around!",
      text: "ScrubHub cleans is one of the best around! Hired them to clean my house and garage. Everything was done in a timely matter and went above and beyond, and a great price! Recommend them to everyone and will definitely be calling them again.",
      name: "Alec Petroff",
      featured: true,
    },
    {
      title: "I highly recommend Scrubhub Cleans LLC!",
      text: "Scrubhub Cleans works great for me and my busy schedule, they thoroughly clean, work quickly and are trustworthy to have in your home/business! I highly recommend Scrubhub Cleans LLC!!!",
      name: "Brenda Tazza",
      featured: false,
    },
    {
      title: "Katrina did an amazing job cleaning my house!",
      text: "I highly recommend ScurbHub Cleans if you’re looking for a cleaning service! It was super easy to schedule an appt and were flexible with my needs! Katrina did an amazing job cleaning my house! She was very thorough and took her time to make sure all my needs were met! My house looks and smells amazing! I will definitely use them again!",
      name: "Laura",
      featured: false,
    },
    {
      title: "They did more than I expected.",
      text: "This is the first time using this type of service and I think I have chosen the right company. The workers showed up and went right to work and they did a fantastic job. They did more than I expected. I was afraid to open my fridge but now I’m opening it up and seeing what I’m looking for. Thanks for your help.",
      name: "Ric Sap",
      featured: false,
    },
    {
      title: "Did everything we asked and more.",
      text: "I contracted with ScrubHub to help my sister- they were fantastic! Did everything we asked and more. They were very quick to respond to my query, were courteous, ON TIME, were very efficient, AND took their trash with them. As I recall she called the two who came as whirlwind Tasmanian Devils. She (my sister) was also very happy with the toilet paper flower in all loos. 🤣 Highly recommend.",
      name: "Joni Braley",
      featured: false,
    },
  ] satisfies Review[],

  /**
   * "Questions before you book?" on the homepage: the objections that stop a
   * booking, answered right before the final call to action. Only entries with
   * `confirmed: true` are shown. The unconfirmed ones are DRAFTS: confirm the
   * facts with the owner, edit the answer, then flip `confirmed` to true.
   */
  objections: [
    {
      question: "How much will it cost?",
      answer:
        "You'll see your exact, itemized price in about 60 seconds, right here on this page. No waiting for a callback, no pressure.",
      confirmed: true,
    },
    {
      question: "When can you come?",
      answer:
        "Right after your price, you'll see the next open time and can grab it in one tap. Need something sooner? Call or text 412-866-2510, any time, 24/7.",
      confirmed: true,
    },
    {
      question: "What if I'm not happy with the clean?",
      answer:
        "Tell us. If we missed something, we come back within 24 hours and make it right. It's the promise our business is built on.",
      confirmed: true,
    },
    {
      question: "Do I pay upfront?",
      answer:
        "No. You add a card to lock in your cleaner, and you're only charged after the job is done and you're happy with it.",
      confirmed: true,
    },
    {
      question: "Will you clean it the way I like it?",
      answer:
        "Yes. There's no such thing as one-size-fits-all. Tell us your priorities and we build every clean around them.",
      confirmed: true,
    },
    {
      question: "Are your cleaners insured and background-checked?",
      answer: "DRAFT: Yes. Every cleaner is background-checked, and we're fully insured and bonded.",
      confirmed: false,
    },
    {
      question: "Do I need to be home?",
      answer: "DRAFT: No. Many clients give us a key or door code. We'll confirm access details when we confirm your booking.",
      confirmed: false,
    },
    {
      question: "Is it okay if I have pets?",
      answer: "DRAFT: Absolutely. Just let us know about them when you book so we can plan around them.",
      confirmed: false,
    },
    {
      question: "Do you bring your own supplies?",
      answer: "DRAFT: Yes. We bring all supplies and equipment. Prefer we use yours? Just ask.",
      confirmed: false,
    },
  ] satisfies { question: string; answer: string; confirmed: boolean }[],

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
