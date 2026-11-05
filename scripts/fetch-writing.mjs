/**
 * Snapshots Jeet's Avesta Labs posts (with covers) into lib/writing-feed.json.
 * Runs as `prebuild`. The live site re-reads the feed hourly on its own
 * (see lib/writing.ts); this snapshot is the build-time copy and the fallback
 * when avestalabs.ai can't be reached.
 * Fails soft: on any error the previously committed snapshot is kept.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchAvestaPosts } from "../lib/avesta-feed.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../lib/writing-feed.json");

try {
  const posts = await fetchAvestaPosts();
  writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), posts }, null, 2) + "\n");
  console.log(`writing feed: ${posts.length} posts snapshotted, ${posts.filter((p) => p.cover).length} with covers`);
} catch (err) {
  console.warn(`writing feed: fetch failed (${err.message}); keeping existing snapshot`);
}
