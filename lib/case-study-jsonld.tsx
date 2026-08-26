import { SITE_URL, absoluteUrl } from "@/lib/seo";

/**
 * Structured data for a case study page.
 *
 * TechArticle rather than Article: these are engineering write-ups with code,
 * and the type is what tells Google the page is technical documentation rather
 * than news. The BreadcrumbList is what produces the
 * "jeetsoni.com > Work > ..." trail in a result instead of a bare URL.
 */
export function caseStudyJsonLd(input: {
  path: string;
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified: string;
  keywords: readonly string[];
}) {
  const url = absoluteUrl(input.path);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: input.headline,
        description: input.description,
        image: absoluteUrl(input.image),
        datePublished: input.datePublished,
        dateModified: input.dateModified,
        inLanguage: "en",
        author: { "@id": `${SITE_URL}/#person` },
        publisher: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        mainEntityOfPage: url,
        keywords: input.keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Selected work", item: `${SITE_URL}/#work` },
          { "@type": "ListItem", position: 3, name: input.headline, item: url },
        ],
      },
    ],
  };
}

/** Renders the graph as the script tag Google reads. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
