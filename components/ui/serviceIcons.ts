import type { ServiceSlug } from "@/content/business";

export const serviceIcon = {
  "maintenance-cleaning": "repeat",
  "deep-cleaning": "layers",
  "move-in-move-out-cleaning": "key",
  "airbnb-turnover-cleaning": "bed",
  "commercial-cleaning": "building",
} as const satisfies Record<ServiceSlug, string>;
