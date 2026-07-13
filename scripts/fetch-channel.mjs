/**
 * Pulls the latest SynapByte uploads from the public YouTube RSS feed
 * (no API key) and snapshots them into lib/channel-feed.json.
 * Runs as `prebuild`, so every deploy refreshes the broadcast deck.
 * Fails soft: on any error the previously committed snapshot is kept.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const CHANNEL_ID = "UCm7x2MjOJjRDDRsouptwh-g";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "../lib/channel-feed.json");

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

try {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`
  );
  if (!res.ok) throw new Error(`feed responded ${res.status}`);
  const xml = await res.text();

  const videos = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, e]) => ({
      id: e.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "",
      title: decode(e.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "")
        .replace(/\s*#shorts\s*$/i, "")
        .trim(),
      short: /youtube\.com\/shorts\//.test(e),
      published: e.match(/<published>(.*?)<\/published>/)?.[1] ?? "",
      views: Number(e.match(/views="(\d+)"/)?.[1] ?? 0),
    }))
    .filter((v) => v.id && v.title);

  if (videos.length === 0) throw new Error("feed parsed to zero videos");

  writeFileSync(OUT, JSON.stringify({ updatedAt: new Date().toISOString(), videos }, null, 2));
  console.log(`channel feed: ${videos.length} videos snapshotted`);
} catch (err) {
  console.warn(`channel feed: fetch failed (${err.message}); keeping existing snapshot`);
}
