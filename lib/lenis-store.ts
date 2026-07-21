import type Lenis from "lenis";

/**
 * The live Lenis instance (home page only; case-study pages scroll
 * natively). Programmatic scrolls MUST go through lenis.scrollTo when it
 * exists: Lenis's RAF rewrites the scroll position every frame, so a plain
 * window.scrollTo({behavior:"smooth"}) is silently fought back to zero.
 */
let instance: Lenis | null = null;

export function setLenis(lenis: Lenis | null): void {
  instance = lenis;
}

function prefersReduced(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Scroll the window to a Y position, Lenis-aware and reduced-motion-aware. */
export function scrollWindowTo(top: number): void {
  const reduced = prefersReduced();
  if (instance) {
    instance.scrollTo(top, { immediate: reduced, duration: 1.1 });
  } else {
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  }
}

/** Scroll an element to the top of the viewport, Lenis-aware. */
export function scrollToElement(el: HTMLElement): void {
  const reduced = prefersReduced();
  if (instance) {
    instance.scrollTo(el, { immediate: reduced, duration: 1.1 });
  } else {
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }
}
