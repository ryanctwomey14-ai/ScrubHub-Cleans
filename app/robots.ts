import type { MetadataRoute } from "next";
import { business } from "@/content/business";
import { isDraft } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (isDraft) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${business.siteUrl}/sitemap.xml`,
  };
}
