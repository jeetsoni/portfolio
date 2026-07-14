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
  const [visible, setVisible] = useState(false);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  // embed.js swaps each <blockquote> for a real <iframe> whenever it feels
  // like it (network + IG's own script, no callback per-card) — a
  // MutationObserver is the only reliable way to know a specific card is
  // ready, so its skeleton can drop away card-by-card instead of all at once.
  const [readyCodes, setReadyCodes] = useState<Set<string>>(new Set());

  // The six reel iframes cost megabytes — don't mount them (or embed.js)
  // until the strip is within a screen or two of the viewport.
  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
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
  }, [visible]);

  // watch for embed.js rendering each card's iframe and drop that card's
  // skeleton the moment it lands, rather than waiting on the slowest one
  useEffect(() => {
    if (!visible) return;
    const el = scroller.current;
    if (!el) return;

    const checkReady = () => {
      const cards = el.querySelectorAll<HTMLElement>("[data-reel-code]");
      setReadyCodes((prev) => {
        let next = prev;
        cards.forEach((card) => {
          const code = card.dataset.reelCode!;
          if (!prev.has(code) && card.querySelector("iframe")) {
            if (next === prev) next = new Set(prev);
            next.add(code);
          }
        });
        return next;
      });
    };

    checkReady();
    const mo = new MutationObserver(checkReady);
    mo.observe(el, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [visible]);

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
      {/* min-h reserves the strip's space so late-hydrating iframes don't shift layout.
          Skeleton cards fill that space until embed.js swaps each blockquote for a
          real iframe — bone-toned since this whole section sits on the light background. */}
      <div
        ref={scroller}
        className="no-scrollbar flex min-h-[560px] snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain pb-2"
      >
        {visible
          ? instagramReels.map((r) => (
              <div
                key={r.code}
                data-reel-code={r.code}
                className="relative w-[328px] shrink-0 snap-start"
                style={{ minHeight: 560 }}
              >
                {/* kept mounted and crossfaded, never unmounted outright —
                    otherwise it disappears the instant the iframe lands, with
                    no transition, which reads as a blink rather than a fade */}
                <span
                  className={`skeleton skeleton-light pointer-events-none absolute inset-0 border border-ink/10 transition-opacity duration-500 ${
                    readyCodes.has(r.code) ? "opacity-0" : "opacity-100"
                  }`}
                  aria-hidden
                />
                <blockquote
                  className="instagram-media"
                  data-instgrm-permalink={`https://www.instagram.com/reel/${r.code}/`}
                  data-instgrm-version="14"
                  style={{ margin: 0, width: "100%", minWidth: 0 }}
                />
              </div>
            ))
          : Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                aria-hidden
                className="skeleton skeleton-light w-[328px] shrink-0 snap-start border border-ink/10"
                style={{ height: 560 }}
              />
            ))}
      </div>
    </div>
  );
}
