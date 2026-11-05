import type { MetadataRoute } from "next";
import { INDEXABLE_ROUTES, absoluteUrl } from "@/lib/seo";
import { getPosts } from "@/lib/writing";

// matches WRITING_REVALIDATE, so /writing/'s lastmod tracks new posts
export const revalidate = 3600;

/**
 * Generated rather than hand-written: the static public/sitemap.xml drifted
 * twice (a stale lastmod, then a renamed route it kept pointing at), because
 * nothing tied it to the routes that actually exist.
 *
 * /writing/ is the one route whose content changes without a deploy, so its
 * lastmod is the newest post's date instead of a hand-kept one.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  return [
    ...INDEXABLE_ROUTES.map((route) => ({
      url: absoluteUrl(route.path),
      lastModified: new Date(route.lastModified),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    {
      url: absoluteUrl("/writing/"),
      lastModified: new Date(posts[0]?.published ?? Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
}
