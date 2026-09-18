/** Kept to two: each extra tab is another way off the path to a price. */
export const primaryNav = [
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
] as const;

/** Quieter pages, linked only from the footer. */
export const footerNav = [
  { href: "/services", label: "Services" },
  { href: "/reviews", label: "Reviews" },
  { href: "/service-areas", label: "Service Area" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

/** Ad landing pages: no navigation at all, just the offer, the phone, and the button. */
export const landingPaths = ["/get-quote"];
