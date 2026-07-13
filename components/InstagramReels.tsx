"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { instagramReels } from "@/lib/data";

/**
 * Real @jeetsoni.ai reels, playable inline via Instagram's own public embed
 * script (no login, no API key — the same mechanism instagram.com/embed.js
 * powers on any site). Sits in the bone section so IG's white embed card
 * blends with the page instead of fighting a dark background.
 *
 * embed.js swaps each blockquote for an iframe that enforces min-width: 326px
 * plus 1px margins, so wrappers must be ≥328px or the iframes overflow and
 * swallow the gap. Those cross-origin iframes also eat wheel/drag events, so
 * desktop can't scroll the strip directly — the arrow buttons drive it.
 */

const CARD_W = 328; // Instagram iframe: 326px min-width + 1px margin each side
const GAP = 20; // matches gap-5

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export default function InstagramReels() {
  const loaded = useRef(false);
  const scroller = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (window.instgrm) {
      window.instgrm.Embeds.process();
      return;
    }
    if (loaded.current) return;
    loaded.current = true;
    const script = document.createElement("script");
    script.src = "https://www.instagram.com/embed.js";
    script.async = true;
    script.onload = () => window.instgrm?.Embeds.process();
    document.body.appendChild(script);
  }, []);

  const updateArrows = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    updateArrows();
    el.addEventListener("scroll", updateArrows, { passive: true });
    // the strip resizes when embed.js hydrates the iframes
    const ro = new ResizeObserver(updateArrows);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      ro.disconnect();
    };
  }, [updateArrows]);

  const scrollByCard = (dir: -1 | 1) =>
    scroller.current?.scrollBy({ left: dir * (CARD_W + GAP), behavior: "smooth" });

  return (
    <div className="mt-14">
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="mono-label">Most-watched · @jeetsoni.ai reels</p>
        <div className="flex gap-2">
          <button
            type="button"
            data-cursor
            aria-label="Scroll reels left"
            disabled={!canPrev}
            onClick={() => scrollByCard(-1)}
            className="grid h-9 w-9 place-items-center border border-ink/20 font-mono text-sm transition-colors hover:bg-ink hover:text-bone disabled:pointer-events-none disabled:opacity-20"
          >
            ←
          </button>
          <button
            type="button"
            data-cursor
            aria-label="Scroll reels right"
            disabled={!canNext}
            onClick={() => scrollByCard(1)}
            className="grid h-9 w-9 place-items-center border border-ink/20 font-mono text-sm transition-colors hover:bg-ink hover:text-bone disabled:pointer-events-none disabled:opacity-20"
          >
            →
          </button>
        </div>
      </div>
      <div
        ref={scroller}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2"
      >
        {instagramReels.map((r) => (
          <div key={r.code} className="w-[328px] shrink-0 snap-start">
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={`https://www.instagram.com/reel/${r.code}/`}
              data-instgrm-version="14"
              style={{ margin: 0, width: "100%", minWidth: 0 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
