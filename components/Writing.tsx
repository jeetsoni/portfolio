"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { writing } from "@/lib/data";
import type { Post } from "@/lib/writing";
import SectionHeading from "./SectionHeading";
import PostList from "./PostList";

const SHOWN = 5;

/**
 * Latest posts from the Avesta Labs blog. Each row links out to the original:
 * the articles live there, this section is the index and the byline.
 * `posts` comes from the server (app/page.tsx), refreshed hourly.
 */
export default function Writing({ posts }: { posts: Post[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".wr-head", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".wr-head", start: "top 82%" },
      });
      gsap.utils.toArray<HTMLElement>(".wr-row").forEach((row) => {
        gsap.from(row, {
          opacity: 0,
          y: 32,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: row, start: "top 88%" },
        });
      });
    },
    { scope: root }
  );

  if (posts.length === 0) return null;

  return (
    <section ref={root} id="writing" className="section-bleed border-t hairline bg-ink">
      <div className="mx-auto max-w-[1600px] px-5 py-28 md:px-10 md:py-40">
        <SectionHeading label="Writing" className="mb-8 md:mb-10" />
        <p className="wr-head max-w-4xl font-sans text-[clamp(1.8rem,4vw,3.4rem)] font-extrabold leading-[1.08] tracking-tight">
          {writing.heading}
        </p>
        <p className="wr-head mt-6 max-w-2xl leading-relaxed text-bone-dim">{writing.body}</p>

        <div className="mt-14">
          <PostList posts={posts.slice(0, SHOWN)} rowClassName="wr-row" />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <a href="/writing/" className="mono-label link-sweep transition-colors hover:text-signal">
            All {posts.length} posts →
          </a>
          <p className="mono-label">
            Published on{" "}
            <a href={writing.publisher.url} target="_blank" rel="noopener" className="link-sweep hover:text-signal">
              {writing.publisher.name}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
