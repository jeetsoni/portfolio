import channelFeed from "@/lib/channel-feed.json";
import { fetchChannelVideos } from "@/lib/youtube-feed.mjs";

export type Video = {
  id: string;
  title: string;
  short: boolean;
  published: string;
  views: number;
};

/**
 * Live SynapByte uploads, cached by Next for an hour (the home page exports
 * the same revalidate), so new videos and view counts reach the broadcast
 * deck without a deploy. Falls back to the build snapshot if YouTube is down.
 */
export async function getChannelVideos(): Promise<Video[]> {
  try {
    return await fetchChannelVideos({ next: { revalidate: 3600 } } as RequestInit);
  } catch {
    return channelFeed.videos as Video[];
  }
}
