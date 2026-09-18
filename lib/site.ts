/**
 * Draft mode: hosted previews (Netlify, Vercel) stay out of search engines until launch.
 * At launch, set SITE_LIVE=true in the host's environment variables.
 */
export const isDraft = Boolean(process.env.NETLIFY || process.env.VERCEL) && process.env.SITE_LIVE !== "true";
