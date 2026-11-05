import type { Metadata } from "next";
import { site, writing } from "@/lib/data";
import { getPosts, type Post } from "@/lib/writing";
import { SITE_URL, absoluteUrl } from "@/lib/seo";
import { JsonLd } from "@/lib/case-study-jsonld";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { GlassNav, GlassFoot } from "@/components/glass/chrome";
import { fontVars } from "@/components/glass/fonts";
import "@/components/glass/glass.css";
import "@/components/glass/case.css";

// matches WRITING_REVALIDATE: new Avesta posts show up within the hour
export const revalidate = 3600;

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
const buildJsonLd = (posts: Post[]) => ({
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
      dateModified: posts[0]?.published.slice(0, 10),
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
            ...(p.cover ? { image: p.cover } : {}),
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
});

const postDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default async function WritingPage() {
  const posts = await getPosts();
  const [lead, ...rest] = posts;

  return (
    <div className={`g ${fontVars}`}>
      <JsonLd data={buildJsonLd(posts)} />
      <GlassNav />
      <main id="top">
        <section className="g-sec w-hero">
          <p className="g-label">
            <span>{String(posts.length).padStart(2, "0")}</span>
            Writing · {posts.length} posts
          </p>
          <h1>{writing.heading}</h1>
          <p className="w-body">{writing.body}</p>
        </section>

        <section className="g-sec w-list" aria-label="All posts">
          {lead && (
            <a href={lead.url} className="w-lead">
              <span className="w-lead-cover">{lead.cover && <img src={lead.cover} alt={lead.title} />}</span>
              <span className="w-lead-body">
                <span className="w-meta">Latest · {postDate(lead.published)}</span>
                <b>{lead.title}</b>
                <em>{lead.description}</em>
                {lead.categories.length > 0 && (
                  <span className="w-cats">{lead.categories.slice(0, 3).map((c) => <i key={c}>{c}</i>)}</span>
                )}
              </span>
            </a>
          )}
          <div className="w-grid">
            {rest.map((p) => (
              <a key={p.slug} href={p.url} className="w-card">
                <span className="w-card-cover">{p.cover && <img src={p.cover} alt={p.title} loading="lazy" />}</span>
                <span className="w-card-body">
                  <small>{postDate(p.published)}</small>
                  <b>{p.title}</b>
                  <em>{p.description}</em>
                  {p.note && <em>{p.note}</em>}
                </span>
              </a>
            ))}
          </div>
          <p className="w-foot">
            All posts by {site.alternateName} ({site.name}) on{" "}
            <a href={site.socials.avestaBlog} target="_blank" rel="noopener">
              {writing.publisher.name} <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
            </a>
          </p>
        </section>
      </main>
      <GlassFoot />
    </div>
  );
}
