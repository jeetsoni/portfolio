/**
 * Reads the latest SynapByte uploads from the public YouTube RSS feed (no API
 * key). Plain .mjs so the prebuild script and the app share one parser; the
 * app passes a revalidating fetch init, the script a plain one.
 */

export const SYNAPBYTE_CHANNEL_ID = "UCm7x2MjOJjRDDRsouptwh-g";

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

/**
 * Newest first, as the feed lists them. Throws when the feed can't be read
 * or parses to nothing, so callers can fall back to their snapshot.
 *
 * @param {RequestInit} [init]
 * @returns {Promise<Array<{id: string, title: string, short: boolean, published: string, views: number}>>}
 */
export async function fetchChannelVideos(init) {
  const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${SYNAPBYTE_CHANNEL_ID}`, init);
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
  return videos;
}
