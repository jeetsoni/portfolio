import type { Metadata } from "next";
import { site, writing } from "@/lib/data";
import { posts, latestPostDate } from "@/lib/writing";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/lib/case-study-jsonld";
import PostList from "@/components/PostList";
import PaletteTrigger from "@/components/palette/PaletteTrigger";

const PATH = "/writing/";
const DESCRIPTION =
  "Jeet Soni's writing on production AI agents: tracing, tool-call failures, LLM-as-a-judge, prompt injection, PII redaction, RAG testing and chunking. Published on the Avesta Labs engineering blog.";

export const metadata: Metadata = {
  title: "Writing · Jeet Soni",
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: {
    title: "Writing · Jeet Soni",
    description: DESCRIPTION,
    type: "website",
    url: PATH,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Jeet Soni, AI Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writing · Jeet Soni",
    description: DESCRIPTION,
    images: ["/og.jpg"],
  },
};

/*
 * The posts live on avestalabs.ai, so each item's url points there and the
 * publisher is Avesta Labs. The author @id is the Person node from the root
 * layout: that is what ties the articles to this site's person in a crawler's
 * graph without duplicating a word of them.
 */
const url = absoluteUrl(PATH);
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      url,
      name: `Writing · ${site.name}`,
      description: DESCRIPTION,
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#person` },
      dateModified: latestPostDate,
      mainEntity: {
        "@type": "ItemList",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: posts.length,
        itemListElement: posts.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "BlogPosting",
            "@id": p.url,
            url: p.url,
            headline: p.title,
            description: p.description,
            datePublished: p.published,
            keywords: p.categories.join(", "),
            author: { "@id": `${SITE_URL}/#person` },
            publisher: { "@type": "Organization", name: writing.publisher.name, url: "https://avestalabs.ai" },
          },
        })),
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Writing", item: url },
      ],
    },
  ],
};

export default function WritingPage() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <header className="fixed inset-x-0 top-0 z-50 border-b hairline bg-ink/70 backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 md:px-10">
          <a href="/#writing" className="mono-label transition-colors hover:text-signal">
            ← {site.name}
          </a>
          <PaletteTrigger className="mono-label flex items-center gap-1.5 rounded-full border hairline px-3.5 py-1.5 transition-colors duration-300 hover:border-signal hover:text-bone" />
        </nav>
      </header>

      <main className="bg-ink text-bone">
        <div className="mx-auto max-w-[1600px] px-5 pb-28 pt-36 md:px-10 md:pb-40 md:pt-44">
          <p className="mono-label text-signal">Writing · {posts.length} posts</p>
          <h1 className="mt-6 max-w-4xl font-sans text-[clamp(2.2rem,5vw,4.4rem)] font-extrabold leading-[1.05] tracking-tight">
            {writing.heading}
          </h1>
          <p className="mt-6 max-w-2xl leading-relaxed text-bone-dim">{writing.body}</p>

          <div className="mt-16">
            <PostList posts={posts} />
          </div>

          <p className="mono-label mt-10">
            All posts by {site.alternateName} ({site.name}) on{" "}
            <a href={site.socials.avestaBlog} target="_blank" rel="noopener" className="link-sweep hover:text-signal">
              {writing.publisher.name} ↗
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
