"use client";

import { useEffect } from "react";

/**
 * Marks every [data-draw] element with data-inview once it scrolls into
 * view, so the CSS can ink its strokes in. One observer for the page.
 */
export default function DrawOnView() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-draw]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => (el.dataset.inview = "1"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.inview = "1";
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: "0px 0px -15% 0px", threshold: 0.15 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
