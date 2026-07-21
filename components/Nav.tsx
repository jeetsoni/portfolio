"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/data";
import Magnetic from "./Magnetic";
import PaletteTrigger from "./palette/PaletteTrigger";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#channel", label: "Channel" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // scroll-spy: whichever section covers the vertical "reading line"
  // (a fixed point below the fixed nav) is the active link. IntersectionObserver
  // with a thin rootMargin band is steadier than tracking scrollY thresholds
  // by hand, especially across the pinned horizontal Projects section.
  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector<HTMLElement>(l.href))
      .filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
        setActive(`#${top.target.id}`);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md bg-ink/70 border-b hairline" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
        <a href="#top" className="font-mono text-sm tracking-widest text-bone">
          JS<span className="live-dot text-signal">_</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className={`mono-label link-sweep transition-colors duration-300 hover:text-signal ${
                  active === l.href ? "text-signal [background-size:100%_1px]" : ""
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2.5">
          <PaletteTrigger className="mono-label flex items-center gap-1.5 rounded-full border hairline px-3.5 py-1.5 transition-colors duration-300 hover:border-signal hover:text-bone" />
          <Magnetic>
            <a
              href={`mailto:${site.email}`}
              className="group hidden items-center gap-2 rounded-full border hairline px-4 py-1.5 transition-colors duration-300 hover:border-signal sm:flex"
            >
              <span className="mono-label transition-colors duration-300 group-hover:text-bone">
                Get in touch
              </span>
            </a>
          </Magnetic>
        </div>
      </nav>
    </header>
  );
}
