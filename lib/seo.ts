/**
 * Every absolute URL the site emits about itself resolves from here.
 *
 * The canonical host is www: Vercel serves the project on www.jeetsoni.com and
 * 308s the apex to it, so a canonical, sitemap entry or og:url on the bare
 * domain points at a URL that immediately redirects. Search engines tolerate
 * that but it wastes crawl budget and splits signals, so the code matches the
 * infrastructure rather than the other way round.
 *
 * next.config.ts sets trailingSlash, so every path below carries one. A
 * canonical whose slash shape differs from the served URL is a duplicate.
 */
import { latestPostDate } from "@/lib/writing";

export const SITE_URL = "https://www.jeetsoni.com";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  return path.startsWith("http") ? path : `${SITE_URL}${path}`;
}

/**
 * Routes that should be indexed, with the date their content genuinely last
 * changed. Hand-maintained on purpose: a sitemap that stamps every page with
 * the build date tells crawlers nothing, and teaches them to distrust lastmod.
 */
export const INDEXABLE_ROUTES = [
  { path: "/", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 1.0 },
  { path: "/work/idea-to-motion/", lastModified: "2026-08-27", changeFrequency: "monthly", priority: 0.9 },
  { path: "/work/dicom-viewer/", lastModified: "2026-07-22", changeFrequency: "monthly", priority: 0.9 },
  // follows the newest post in the Avesta feed snapshot, the one thing that changes the page
  { path: "/writing/", lastModified: latestPostDate, changeFrequency: "weekly", priority: 0.8 },
] as const;
