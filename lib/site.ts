/**
 * Draft mode: hosted previews stay out of search engines until launch.
 * On for Netlify/Vercel builds (or SITE_DRAFT=true); set SITE_LIVE=true at launch.
 */
export const isDraft =
  (Boolean(process.env.NETLIFY || process.env.VERCEL) || process.env.SITE_DRAFT === "true") &&
  process.env.SITE_LIVE !== "true";
