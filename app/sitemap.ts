import type { MetadataRoute } from "next";
import { business } from "@/content/business";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = business.siteUrl;
  const now = new Date();
  const pages = ["", "/services", "/about", "/service-areas", "/reviews", "/faq", "/contact"];

  return [
    ...pages.map((p) => ({
      url: `${base}${p}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : p === "/contact" || p === "/services" ? 0.9 : 0.7,
    })),
    ...business.services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
