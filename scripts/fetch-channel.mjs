/**
 * Snapshots the latest SynapByte uploads into lib/channel-feed.json.
 * Runs as `prebuild`. The live site re-reads the feed hourly on its own
 * (see lib/channel.ts); this snapshot is the build-time copy and the fallback
 * when YouTube can't be reached.
 * Fails soft: on any error the previously committed snapshot is kept.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { fetchChannelVideos } from "../lib/youtube-feed.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "../lib/channel-feed.json");

try {
  const videos = await fetchChannelVideos();
  writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), videos }, null, 2));
  console.log(`channel feed: ${videos.length} videos snapshotted`);
} catch (err) {
  console.warn(`channel feed: fetch failed (${err.message}); keeping existing snapshot`);
}
