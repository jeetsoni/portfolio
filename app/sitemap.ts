import type { MetadataRoute } from "next";
import { INDEXABLE_ROUTES, absoluteUrl } from "@/lib/seo";

/**
 * Generated rather than hand-written: the static public/sitemap.xml drifted
 * twice (a stale lastmod, then a renamed route it kept pointing at), because
 * nothing tied it to the routes that actually exist.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return INDEXABLE_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: new Date(route.lastModified),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
