"use client";

import { useEffect } from "react";

/**
 * Marks the nav link whose section is under the reading line (a band just
 * below the fixed nav) with aria-current, so the nav shows where you are.
 */
export default function NavSpy() {
  useEffect(() => {
    const links = [...document.querySelectorAll<HTMLAnchorElement>(".g-nav nav a[href^='#']")];
    const sections = links.map((a) => document.querySelector<HTMLElement>(a.hash)).filter((s): s is HTMLElement => !!s);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          links.forEach((a) => a.setAttribute("aria-current", String(a.hash === `#${e.target.id}`)));
        });
      },
      { rootMargin: "-20% 0px -75% 0px" }
    );
    sections.forEach((s) => io.observe(s));
    // nothing current while the hero is on screen
    const clear = () => {
      if (window.scrollY < (sections[0].offsetTop ?? 0) - window.innerHeight * 0.3) links.forEach((a) => a.setAttribute("aria-current", "false"));
    };
    window.addEventListener("scroll", clear, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", clear);
    };
  }, []);
  return null;
}
