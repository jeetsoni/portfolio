import writingFeed from "@/lib/writing-feed.json";
import { writing } from "@/lib/data";
import { fetchAvestaPosts } from "@/lib/avesta-feed.mjs";

export type Post = {
  slug: string;
  title: string;
  url: string;
  description: string;
  published: string;
  categories: string[];
  /** og:image of the post page; "" when it couldn't be read */
  cover: string;
  /** first-person context from lib/data.ts, when written */
  note?: string;
};

/**
 * How stale the live list may get, in seconds. Pages that render posts export
 * the same number as `revalidate` (Next needs a literal there), so a new
 * Avesta post appears within the hour with no rebuild.
 */
export const WRITING_REVALIDATE = 3600;

const withNotes = (list: Post[]): Post[] => list.map((p) => ({ ...p, note: writing.notes[p.slug] }));

/** The build-time copy. Used where a sync value is needed (the agent's knowledge). */
export const snapshotPosts: Post[] = withNotes(writingFeed.posts as Post[]);

/**
 * Live list from the Avesta feed, cached by Next for WRITING_REVALIDATE.
 * Falls back to the snapshot if the feed is unreachable, and keeps a snapshot
 * cover for any post whose page couldn't be read this time.
 */
export async function getPosts(): Promise<Post[]> {
  try {
    const live = await fetchAvestaPosts({ next: { revalidate: WRITING_REVALIDATE } } as RequestInit);
    const snapCover = new Map(snapshotPosts.map((p) => [p.slug, p.cover]));
    return withNotes(live.map((p) => ({ ...p, cover: p.cover || snapCover.get(p.slug) || "" })));
  } catch {
    return snapshotPosts;
  }
}

export const fmtPostDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
