import writingFeed from "@/lib/writing-feed.json";
import { writing } from "@/lib/data";

export type Post = {
  slug: string;
  title: string;
  url: string;
  description: string;
  published: string;
  categories: string[];
  /** first-person context from lib/data.ts, when written */
  note?: string;
};

/** Newest first, with any personal note attached. */
export const posts: Post[] = (writingFeed.posts as Post[]).map((p) => ({
  ...p,
  note: writing.notes[p.slug],
}));

export const latestPostDate = posts[0]?.published.slice(0, 10) ?? "2026-11-05";

export const fmtPostDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
