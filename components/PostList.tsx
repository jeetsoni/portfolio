import { fmtPostDate, type Post } from "@/lib/writing";

/** Date · title + one line · "Read ↗". Every row opens the original post. */
export default function PostList({ posts, rowClassName = "" }: { posts: Post[]; rowClassName?: string }) {
  return (
    <ol className="border-t hairline">
      {posts.map((p) => (
        <li key={p.slug} className={`border-b hairline ${rowClassName}`}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener"
            className="group grid gap-3 py-8 md:grid-cols-[11rem_1fr_auto] md:items-baseline md:gap-10"
          >
            <time dateTime={p.published} className="mono-label">
              {fmtPostDate(p.published)}
            </time>
            <span>
              <span className="block font-sans text-xl font-bold tracking-tight transition-colors duration-300 group-hover:text-signal md:text-2xl">
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
