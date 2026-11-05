/**
 * Pulls Jeet's posts from the Avesta Labs blog RSS (filtered by dc:creator)
 * and snapshots them into lib/writing-feed.json.
 * Runs as `prebuild`, so every deploy picks up new posts.
 * Fails soft: on any error the previously committed snapshot is kept.
 *
 * Only titles, dates, categories and the feed's own one-line description are
 * kept. The articles themselves stay on avestalabs.ai: copying the full text
 * here would make a duplicate that competes with the original in search.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const FEED = "https://avestalabs.ai/blog/rss.xml";
const AUTHOR = "Jeet Adeshara";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "../lib/writing-feed.json");

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

try {
  const res = await fetch(FEED);
  if (!res.ok) throw new Error(`feed responded ${res.status}`);
  const xml = await res.text();

  const posts = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
    .map(([, item]) => item)
    .filter((item) => tag(item, "dc:creator") === AUTHOR)
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

  if (posts.length === 0) throw new Error(`no posts by ${AUTHOR} in the feed`);

  writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), posts }, null, 2) + "\n");
  console.log(`writing feed: ${posts.length} posts snapshotted`);
} catch (err) {
  console.warn(`writing feed: fetch failed (${err.message}); keeping existing snapshot`);
}
