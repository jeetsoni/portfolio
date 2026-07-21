import { projects, site } from "@/lib/data";
import { scrollToElement } from "@/lib/lenis-store";

export type PaletteAction = {
  id: string;
  label: string;
  hint: string;
  keywords: string;
  run: () => string;
};

const SECTION_LABELS: Record<string, string> = {
  top: "Top",
  about: "About",
  experience: "Experience",
  work: "Selected Builds",
  channel: "Teaching",
  contact: "Contact",
};

export function goToSection(section: string): string {
  const label = SECTION_LABELS[section] ?? section;
  if (window.location.pathname !== "/") {
    window.location.assign(`/#${section}`);
    return `opening ${label}`;
  }
  const el = document.getElementById(section);
  if (el) scrollToElement(el);
  return `scrolled to ${label}`;
}

export function showProject(slug: string): string {
  const project = projects.find((p) => p.slug === slug);
  const title = project?.title ?? slug;
  if (window.location.pathname !== "/") {
    window.location.assign(`/?project=${slug}`);
    return `opening ${title}`;
  }
  window.dispatchEvent(
    new CustomEvent("palette:show-project", { detail: { slug } })
  );
  return `showed ${title}`;
}

export function openCaseStudy(slug: string): string {
  const href = slug === "dicom-viewer" ? "/work/dicom-viewer/" : "/work/kalpana-ai/";
  const title = slug === "dicom-viewer" ? "DICOM Viewer + PACS" : "KalpanaAI";
  window.location.assign(href);
  return `opening the ${title} case study`;
}

/** Executes a tool call emitted by the server; returns a chip label. */
export function executeAgentTool(
  toolName: string,
  input: unknown
): { ok: boolean; did: string } {
  const args = (input ?? {}) as Record<string, string>;
  try {
    if (toolName === "go_to_section" && args.section) {
      return { ok: true, did: goToSection(args.section) };
    }
    if (toolName === "show_project" && args.slug) {
      return { ok: true, did: showProject(args.slug) };
    }
    if (toolName === "open_case_study" && args.slug) {
      return { ok: true, did: openCaseStudy(args.slug) };
    }
    return { ok: false, did: `unknown tool ${toolName}` };
  } catch {
    return { ok: false, did: "action failed" };
  }
}

export function buildActions(onDone: (note: string) => void): PaletteAction[] {
  const done = (note: string) => {
    onDone(note);
    return note;
  };

  const actions: PaletteAction[] = [
    { id: "go-work", label: "Go to Selected Builds", hint: "Section", keywords: "work projects builds portfolio", run: () => done(goToSection("work")) },
    { id: "go-about", label: "Go to About", hint: "Section", keywords: "about who bio", run: () => done(goToSection("about")) },
    { id: "go-experience", label: "Go to Experience", hint: "Section", keywords: "experience trajectory jobs career avestalabs", run: () => done(goToSection("experience")) },
    { id: "go-channel", label: "Go to Teaching", hint: "Section", keywords: "channel teaching videos synapbyte youtube reels", run: () => done(goToSection("channel")) },
    { id: "go-contact", label: "Go to Contact", hint: "Section", keywords: "contact email talk hire", run: () => done(goToSection("contact")) },
    { id: "cs-kalpana", label: "Open KalpanaAI case study", hint: "Case study", keywords: "kalpana video case study read", run: () => done(openCaseStudy("kalpana-ai")) },
    { id: "cs-dicom", label: "Open DICOM Viewer + PACS case study", hint: "Case study", keywords: "dicom pacs radiology case study read", run: () => done(openCaseStudy("dicom-viewer")) },
  ];

  for (const p of projects) {
    actions.push({
      id: `show-${p.slug}`,
      label: `Show ${p.title}`,
      hint: "Project",
      keywords: `${p.title} ${p.kicker} project card`,
      run: () => done(showProject(p.slug)),
    });
  }

  actions.push(
    {
      id: "copy-email",
      label: "Copy email address",
      hint: "Contact",
      keywords: "email copy contact mail",
      run: () => {
        void navigator.clipboard?.writeText(site.email);
        return done("email copied");
      },
    },
    { id: "open-github", label: "Open GitHub", hint: "Link", keywords: "github code repos", run: () => { window.open(site.socials.github, "_blank", "noopener"); return done("opening GitHub"); } },
    { id: "open-linkedin", label: "Open LinkedIn", hint: "Link", keywords: "linkedin profile", run: () => { window.open(site.socials.linkedin, "_blank", "noopener"); return done("opening LinkedIn"); } },
    { id: "open-youtube", label: "Open YouTube", hint: "Link", keywords: "youtube videos synapbyte", run: () => { window.open(site.socials.youtube, "_blank", "noopener"); return done("opening YouTube"); } }
  );

  return actions;
}

/** Tiny subsequence scorer: word-prefix beats subsequence, no dependency. */
export function fuzzyScore(query: string, action: PaletteAction): number {
  const q = query.trim().toLowerCase();
  if (!q) return 1;
  const hay = `${action.label} ${action.keywords}`.toLowerCase();

  if (hay.includes(q)) return 100 - hay.indexOf(q);

  for (const word of q.split(/\s+/)) {
    if (!hay.includes(word)) {
      // full subsequence fallback across the label only
      let i = 0;
      for (const ch of action.label.toLowerCase()) {
        if (ch === q[i]) i++;
        if (i === q.length) return 10;
      }
      return 0;
    }
  }
  return 50;
}
