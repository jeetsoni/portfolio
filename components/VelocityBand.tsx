"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * A giant outlined word-band that drifts sideways and reacts to scroll
 * velocity: scroll faster and it speeds up and skews, then settles.
 */
export default function VelocityBand({ text }: { text: string }) {
  const track = useRef<HTMLDivElement>(null);
  const half = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = track.current!;
    let x = 0;
    let lastY = window.scrollY;
    let skew = 0;

    const tick = (_t: number, deltaMs: number) => {
      const y = window.scrollY;
      const vel = y - lastY;
      lastY = y;

      const w = half.current?.offsetWidth || 1;
      x -= (0.045 + Math.min(Math.abs(vel), 90) * 0.0035) * deltaMs;
      if (x <= -w) x += w;

      const targetSkew = gsap.utils.clamp(-10, 10, vel * 0.22);
      skew += (targetSkew - skew) * 0.12;

      el.style.transform = `translateX(${x}px) skewX(${skew}deg)`;
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, []);

  const row = Array(6).fill(text);

  return (
    <div aria-hidden className="overflow-hidden border-y hairline py-6 md:py-8">
      <div ref={track} className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            ref={copy === 0 ? half : undefined}
            className="flex shrink-0 items-center"
          >
            {row.map((t, i) => (
              <span key={i} className="flex items-center whitespace-nowrap">
                <span className="text-outline px-6 font-sans text-[clamp(2.6rem,7vw,6rem)] font-black uppercase leading-none tracking-tight">
                  {t}
                </span>
                <span className="text-2xl text-signal md:text-4xl">✳</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
