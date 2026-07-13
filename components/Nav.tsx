"use client";

import { useEffect, useState } from "react";
import { site } from "@/lib/data";
import Magnetic from "./Magnetic";

const links = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#channel", label: "Channel" },
  { href: "#contact", label: "Contact" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md bg-ink/70 border-b hairline" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
        <a href="#top" className="font-mono text-sm tracking-widest text-bone">
          JA<span className="live-dot text-signal">_</span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="mono-label link-sweep transition-colors duration-300 hover:text-signal"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <Magnetic>
          <a
            href={`mailto:${site.email}`}
            className="group flex items-center gap-2 rounded-full border hairline px-4 py-1.5 transition-colors duration-300 hover:border-signal"
          >
            <span className="mono-label transition-colors duration-300 group-hover:text-bone">
              Get in touch
            </span>
          </a>
        </Magnetic>
      </nav>
    </header>
  );
}
