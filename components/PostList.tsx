import { fmtPostDate, type Post } from "@/lib/writing";

/**
 * Cover · date, title + one line, tags · "Read ↗". Every row opens the
 * original post. Covers are Avesta's 1200x630 share images, loaded from
 * avestalabs.ai; the fixed aspect box holds their space while they load.
 */
export default function PostList({ posts, rowClassName = "" }: { posts: Post[]; rowClassName?: string }) {
  return (
    <ol className="border-t hairline">
      {posts.map((p) => (
        <li key={p.slug} className={`border-b hairline ${rowClassName}`}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener"
            className="group grid gap-5 py-8 md:grid-cols-[17rem_1fr_auto] md:items-start md:gap-10"
          >
            <span className="relative block aspect-[1200/630] overflow-hidden border hairline bg-ink-2">
              {p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover}
                  alt=""
                  width={1200}
                  height={630}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              ) : (
                <span className="mono-label absolute inset-0 flex items-center justify-center">Avesta Labs</span>
              )}
            </span>
            <span>
              <time dateTime={p.published} className="mono-label">
                {fmtPostDate(p.published)}
              </time>
              <span className="mt-2 block font-sans text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-signal md:text-2xl">
                {p.title}
              </span>
              <span className="mt-2 block max-w-3xl leading-relaxed text-bone-dim">
                {p.note ?? p.description}
              </span>
              {p.categories.length > 0 && (
                <span className="mt-4 flex flex-wrap gap-2">
                  {p.categories.map((c) => (
                    <span
                      key={c}
                      className="border hairline px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest text-bone-dim"
                    >
                      {c}
                    </span>
                  ))}
                </span>
              )}
            </span>
            <span className="mono-label transition-colors duration-300 group-hover:text-signal">Read ↗</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
