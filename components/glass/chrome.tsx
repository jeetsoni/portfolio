import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/lib/data";

const LINKS = [
  { id: "about", label: "About" },
  { id: "work", label: "Work" },
  { id: "career", label: "Career" },
  { id: "stack", label: "Stack" },
  { id: "writing", label: "Writing" },
  { id: "teaching", label: "Teaching" },
];

/** The fixed nav. On the homepage links are in-page anchors; elsewhere they lead back home. */
export function GlassNav({ onHome = false }: { onHome?: boolean }) {
  const to = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  return (
    <header className="g-nav">
      <a href={onHome ? "#top" : "/"} className="g-mark">
        <i aria-hidden="true" />
        Jeet Soni
      </a>
      <nav aria-label="Sections">
        {LINKS.map((l) => (
          <a key={l.id} href={l.id === "writing" && !onHome ? "/writing/" : to(l.id)}>
            {l.label}
          </a>
        ))}
      </nav>
      <a href={`mailto:${site.email}`} className="g-btn g-btn-sm">
        <EnvelopeSimple size={16} weight="bold" aria-hidden="true" />
        Email
      </a>
    </header>
  );
}

export function GlassFoot() {
  return (
    <footer className="g-foot">
      <span>© 2026 Jeet Soni</span>
      <span>Built with Next.js and three.js</span>
    </footer>
  );
}
