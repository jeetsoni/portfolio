"use client";

import { useEffect, useRef } from "react";
import { instagramReels } from "@/lib/data";

/**
 * Real @jeetsoni.ai reels, playable inline via Instagram's own public embed
 * script (no login, no API key — the same mechanism instagram.com/embed.js
 * powers on any site). Sits in the bone section so IG's white embed card
 * blends with the page instead of fighting a dark background.
 */

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export default function InstagramReels() {
  const loaded = useRef(false);

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

  return (
    <div className="mt-14">
      <p className="mono-label mb-5">Most-watched · @jeetsoni.ai reels</p>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2">
        {instagramReels.map((r) => (
          <div key={r.code} className="w-[300px] shrink-0 snap-start">
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
