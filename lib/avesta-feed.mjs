/**
 * Reads Jeet's posts from the Avesta Labs blog. Plain .mjs so the prebuild
 * script (node, no bundler) and the app (Next, with revalidating fetches)
 * share one parser.
 *
 * The RSS has no images, so each post's cover comes from its page's
 * og:image. Only metadata is kept: the articles stay on avestalabs.ai, where
 * a copy here would compete with the original in search.
 */

export const AVESTA_FEED = "https://avestalabs.ai/blog/rss.xml";
export const AVESTA_AUTHOR = "Jeet Adeshara";

const decode = (s) =>
  s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();

const tag = (item, name) => decode(item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1] ?? "");

/** og:image of one post page, or "" when the page or tag is missing. */
async function fetchCover(url, init) {
  try {
    const res = await fetch(url, init);
    if (!res.ok) return "";
    const html = await res.text();
    const m =
      html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/) ??
      html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/);
    return m ? decode(m[1]) : "";
  } catch {
    return "";
  }
}

/**
 * Newest first. Throws if the feed can't be read or has no posts by the
 * author, so callers can fall back to their snapshot. A cover that can't be
 * fetched comes back as "" rather than failing the whole list.
 *
 * @param {RequestInit} [init] passed to every fetch (Next adds `next.revalidate`)
 * @returns {Promise<Array<{slug: string, title: string, url: string, description: string, published: string, categories: string[], cover: string}>>}
 */
export async function fetchAvestaPosts(init) {
  const res = await fetch(AVESTA_FEED, init);
  if (!res.ok) throw new Error(`feed responded ${res.status}`);
  const xml = await res.text();

  const posts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map(([, item]) => item)
    .filter((item) => tag(item, "dc:creator") === AVESTA_AUTHOR)
    .map((item) => {
      const url = tag(item, "link");
      return {
        slug: url.replace(/\/+$/, "").split("/").pop() ?? "",
        title: tag(item, "title"),
        url,
        description: tag(item, "description"),
        published: new Date(tag(item, "pubDate")).toISOString(),
        categories: [...item.matchAll(/<category>([\s\S]*?)<\/category>/g)].map(([, c]) => decode(c)),
      };
    })
    .filter((p) => p.slug && p.title && p.url)
    .sort((a, b) => b.published.localeCompare(a.published));

  if (posts.length === 0) throw new Error(`no posts by ${AVESTA_AUTHOR} in the feed`);

  const covers = await Promise.all(posts.map((p) => fetchCover(p.url, init)));
  return posts.map((p, i) => ({ ...p, cover: covers[i] }));
}
