import { projects } from "@/lib/data";
import CaseStudy, { type Study } from "./CaseStudy";
import DrawOnView from "./DrawOnView";
import { GlassNav, GlassFoot } from "./chrome";
import { fontVars } from "./fonts";
import { ideaToMotionWalkthrough, ideaToMotionOutput } from "./walkthrough";
import "./glass.css";
import "./case.css";

/** Page shell for a case study: chrome, the shared template, and a "next" link. */
export default function CaseStudyPage({ slug, study }: { slug: string; study: Study }) {
  const project = projects.find((p) => p.slug === slug)!;
  const other = projects.find((p) => p.caseStudyHref && p.slug !== slug)!;
  return (
    <div className={`g ${fontVars}`}>
      <DrawOnView />
      <GlassNav />
      <CaseStudy
        study={study}
        image={project.image ?? ""}
        imageAlt={project.imageAlt ?? ""}
        next={{ title: other.title, href: other.caseStudyHref!, kicker: other.kicker }}
        walkthrough={slug === "idea-to-motion" ? { ...ideaToMotionWalkthrough, output: ideaToMotionOutput } : undefined}
      />
      <GlassFoot />
    </div>
  );
}
