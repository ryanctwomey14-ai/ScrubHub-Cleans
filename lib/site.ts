/**
 * Draft mode: hosted previews (Vercel) stay out of search engines until launch.
 * At launch, set SITE_LIVE=true in the Vercel project's environment variables.
 */
export const isDraft = Boolean(process.env.VERCEL) && process.env.SITE_LIVE !== "true";
