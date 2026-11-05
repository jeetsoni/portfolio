import {
  ArrowRight,
  ArrowUpRight,
  GithubLogo,
  InstagramLogo,
  LinkedinLogo,
  Play,
  SealCheck,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { site, about, stats, projects, experience, educator, certification, writing } from "@/lib/data";
import { getPosts } from "@/lib/writing";
import { getChannelVideos } from "@/lib/channel";
import GlassStory from "@/components/glass/GlassStory";
import Flow from "@/components/glass/Flow";
import DrawOnView from "@/components/glass/DrawOnView";
import NavSpy from "@/components/glass/NavSpy";
import { GlassNav, GlassFoot } from "@/components/glass/chrome";
import { flows, dagLayers, industries, stackLayers } from "@/components/glass/flows";
import { fontVars } from "@/components/glass/fonts";
import "@/components/glass/glass.css";

// hourly: new Avesta posts and SynapByte uploads show up without a deploy
export const revalidate = 3600;

const views = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n));
const postDate = (iso: string) => new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const yearOf = (s: string) => Number(s.match(/\d{4}/)?.[0]);
const stat = (value: number) => stats.find((s) => s.value === value)!;

function Head({ id, no, label, children }: { id: string; no: string; label: string; children: React.ReactNode }) {
  return (
    <header className="g-head">
      <p className="g-label">
        <span>{no}</span>
        {label}
      </p>
      <h2 id={id}>{children}</h2>
    </header>
  );
}

export default async function Home() {
  const [posts, videos] = await Promise.all([getPosts(), getChannelVideos()]);
  const now = experience[0];
  const systems = projects.filter((p) => flows[p.slug]);
  const others = projects.filter((p) => !flows[p.slug]);
  const rail = videos.filter((v) => v.views > 0).slice(0, 10);
  const [lead, ...restPosts] = posts;

  // career rail runs from the first job to today
  const start = Math.min(...experience.map((j) => yearOf(j.period)));
  const end = 2026.9;
  const pct = (y: number) => ((y - start) / (end - start)) * 100;

  // the 17-agent network, laid out as layers
  const dag = dagLayers.map((count, c) => Array.from({ length: count }, (_, r) => ({ x: 24 + c * 54, y: 80 + (r - (count - 1) / 2) * 32 })));

  return (
    <div className={`g ${fontVars}`}>
      <DrawOnView />
      <NavSpy />
      <GlassNav onHome />

      <main id="top">
        <GlassStory name={`${site.name} · ${site.role}`} />

        {/* ---------- about ---------- */}
        <section id="about" className="g-sec" aria-labelledby="about-title">
          <Head id="about-title" no="01" label="About">
            Founding engineer of an enterprise agent platform.
          </Head>
          <div className="about">
            <p className="about-lead">{about.intro}</p>
            <div className="about-body">
              {about.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </div>
            <dl className="about-facts">
              <div><dt>Now</dt><dd>{now.role}, {now.company}</dd></div>
              <div><dt>Based in</dt><dd>{site.location}</dd></div>
              <div><dt>Education</dt><dd>B.Tech IT · Marwadi University</dd></div>
              <div><dt>Writes as</dt><dd>{site.alternateName} on {writing.publisher.name}</dd></div>
            </dl>
          </div>
        </section>

        {/* ---------- numbers ---------- */}
        <section className="g-sec" aria-labelledby="numbers-title">
          <Head id="numbers-title" no="02" label="In numbers">
            Five years of shipping, measured.
          </Head>
          <div className="nums">
            <article className="num" data-draw>
              <p className="num-big">{stat(10).value}<sup>{stat(10).suffix}</sup></p>
              <p className="num-label">{stat(10).label}</p>
              <div className="num-visual">
                <div className="num-pills" aria-label={`${stat(6).value} ${stat(6).label}`}>
                  {industries.map((n, i) => (
                    <span key={n} style={{ ["--i" as string]: i }}>{n}</span>
                  ))}
                </div>
              </div>
            </article>

            <article className="num" data-draw>
              <p className="num-big">{stat(17).value}</p>
              <p className="num-label">{stat(17).label}</p>
              <div className="num-visual">
                <svg className="num-dag" viewBox="0 0 320 160" aria-hidden="true">
                  <defs>
                    <linearGradient id="beam" x1="0" x2="1">
                      <stop offset="0" stopColor="#8fb8ff" stopOpacity="0.15" />
                      <stop offset="1" stopColor="#8fb8ff" stopOpacity="0.45" />
                    </linearGradient>
                    <radialGradient id="orb" cx="35%" cy="30%" r="75%">
                      <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
                      <stop offset="0.35" stopColor="#bcd4ff" stopOpacity="0.55" />
                      <stop offset="1" stopColor="#3a6fb8" stopOpacity="0.35" />
                    </radialGradient>
                  </defs>
                  {dag.slice(0, -1).flatMap((col, c) =>
                    col.flatMap((a, i) =>
                      dag[c + 1]
                        .filter((_, j) => Math.abs(j / Math.max(1, dag[c + 1].length - 1) - i / Math.max(1, col.length - 1)) < 0.55)
                        .map((b, j) => <line key={`${c}${i}${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="url(#beam)" strokeWidth="3" strokeLinecap="round" />)
                    )
                  )}
                  {dag.flat().map((p, k) => (
                    <circle key={k} cx={p.x} cy={p.y} r="9" fill="url(#orb)" className="dag-orb" style={{ ["--d" as string]: `${(k * 0.37) % 3}s` }} />
                  ))}
                </svg>
              </div>
            </article>

            <article className="num" data-draw>
              <p className="num-big">{stat(5).value}<sup>{stat(5).suffix}</sup></p>
              <p className="num-label">{stat(5).label}</p>
              <div className="num-visual">
                <div className="num-years">
                  {[...experience].reverse().map((j) => {
                    const s = yearOf(j.period);
                    const e = j.period.includes("Present") ? end : yearOf(j.period.split("→")[1] ?? "") + 0.4;
                    return (
                      <div key={j.company} className="yr">
                        <span>{j.company.split(" ·")[0].replace(" Technologies", "")}</span>
                        <i style={{ marginLeft: `${pct(s)}%`, width: `${Math.max(3, pct(e) - pct(s))}%` }} data-now={j === now ? "1" : "0"} />
                      </div>
                    );
                  })}
                  <div className="yr yr-axis" aria-hidden="true">
                    <span />
                    <p>
                      <small>{start}</small>
                      <small>{Math.round((start + 2026) / 2)}</small>
                      <small>Now</small>
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ---------- work ---------- */}
        <section id="work" className="g-sec" aria-labelledby="work-title">
          <Head id="work-title" no="03" label="Selected work">
            Systems in production, and how each one runs.
          </Head>
          <div className="works">
            {systems.map((p) => (
              <article key={p.slug} className="work" data-draw>
                <div className="work-device">
                  <div className="device">
                    {p.image && <img src={p.image} alt={p.imageAlt ?? ""} loading="lazy" />}
                  </div>
                </div>
                <div className="work-body">
                  <p className="work-meta">
                    <span className="work-no">{p.index}</span>
                    <span className="work-status" data-live={p.status === "LIVE" ? "1" : "0"}>{p.status}</span>
                  </p>
                  <h3>{p.title}</h3>
                  <p className="work-kicker">{p.kicker}</p>
                  <p className="work-desc">{p.description}</p>
                  <ul className="work-points">
                    {p.highlights.map((h) => <li key={h.slice(0, 24)}>{h}</li>)}
                  </ul>
                  <div className="work-links">
                    {p.caseStudyHref && (
                      <a href={p.caseStudyHref} className="g-btn">
                        Read the build <ArrowRight size={16} weight="bold" aria-hidden="true" />
                      </a>
                    )}
                    {p.link && (
                      <a href={p.link} className="g-btn g-btn-ghost">
                        {p.linkLabel ?? "Open"} <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="work-run">
                  <p className="work-run-label">How it runs</p>
                  <Flow steps={flows[p.slug].steps} note={flows[p.slug].redline} title={p.title} />
                  <ul className="tags">
                    {p.stack.map((s) => <li key={s}>{s}</li>)}
                  </ul>
                </div>
              </article>
            ))}
          </div>
          {others.map((p) => (
            <a key={p.slug} href={p.link} className="also">
              {p.image && <img src={p.image} alt={p.imageAlt ?? ""} loading="lazy" />}
              <span>
                <small>Also shipped · {p.kicker}</small>
                <b>{p.title}</b>
                <em>{p.description}</em>
                <em className="also-points">{p.highlights.join(". ")}.</em>
              </span>
              <ArrowUpRight size={20} aria-hidden="true" />
            </a>
          ))}
        </section>

        {/* ---------- career ---------- */}
        <section id="career" className="g-sec" aria-labelledby="career-title">
          <Head id="career-title" no="04" label="Career">
            From web platforms to agent platforms.
          </Head>
          <div className="career" data-draw>
            <div className="track" aria-hidden="true">
              <i className="track-fill" />
              {experience.map((j, i) => (
                <span key={j.company} className="track-orb" style={{ left: `${pct(yearOf(j.period))}%` }} data-now={i === 0 ? "1" : "0"}>
                  <small>{yearOf(j.period)}</small>
                </span>
              ))}
              <span className="track-now">Now</span>
            </div>
            <ol className="jobs">
              {experience.map((j, i) => (
                <li key={j.company} data-now={i === 0 ? "1" : "0"}>
                  <p className="job-when">{j.period.replace("→", "–")}</p>
                  <h3>{j.role}</h3>
                  <p className="job-at">{j.company} · {j.place}</p>
                  <ul className="job-points">
                    {j.points.map((pt) => <li key={pt.slice(0, 24)}>{pt}</li>)}
                  </ul>
                  <ul className="tags tags-sm">
                    {j.tags.map((t) => <li key={t}>{t}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- stack ---------- */}
        <section id="stack" className="g-sec" aria-labelledby="stack-title">
          <Head id="stack-title" no="05" label="The stack">
            Every layer of an agent system.
          </Head>
          <div className="stack" data-draw>
            <div className="slabs" aria-hidden="true">
              {stackLayers.map((l, i) => (
                <div key={l.name} className="slab" style={{ ["--k" as string]: stackLayers.length - 1 - i }}>
                  <span>{i + 1}</span>
                </div>
              ))}
            </div>
            <ol className="layers">
              {stackLayers.map((l, i) => (
                <li key={l.name}>
                  <span className="layer-no">{i + 1}</span>
                  <div>
                    <b>{l.name}</b>
                    <p>{l.items.join(" · ")}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a href={certification.href} className="cert">
              <span className="cert-medal" aria-hidden="true">
                <SealCheck size={30} weight="fill" />
              </span>
              <span>
                <b>{certification.title}</b>
                <small>
                  {certification.org} · <span className="nowrap">scored {certification.score}</span>
                </small>
              </span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* ---------- writing ---------- */}
        <section id="writing" className="g-sec" aria-labelledby="writing-title">
          <Head id="writing-title" no="06" label="Writing">
            {writing.heading}
          </Head>
          <p className="g-sub">{writing.body}</p>
          <div className="posts">
            {lead && (
              <a href={lead.url} className="post-lead">
                <span className="post-cover">{lead.cover && <img src={lead.cover} alt="" loading="lazy" />}</span>
                <span className="post-lead-body">
                  <small>Latest · {postDate(lead.published)}</small>
                  <b>{lead.title}</b>
                  <em>{lead.description}</em>
                </span>
              </a>
            )}
            <ul className="post-list">
              {restPosts.slice(0, 4).map((p) => (
                <li key={p.slug}>
                  <a href={p.url}>
                    <span className="post-thumb">{p.cover && <img src={p.cover} alt="" loading="lazy" />}</span>
                    <span>
                      <small>{postDate(p.published)}</small>
                      <b>{p.title}</b>
                      <em>{p.description}</em>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="posts-foot">
            <a href="/writing/" className="g-btn g-btn-ghost">
              All writing <ArrowRight size={16} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </section>

        {/* ---------- teaching ---------- */}
        <section id="teaching" className="g-sec" aria-labelledby="teaching-title">
          <Head id="teaching-title" no="07" label="Teaching">
            I explain these systems on camera.
          </Head>
          <p className="g-sub">{educator.body}</p>
          <div className="aud" data-draw>
            {educator.channels.map((c) => (
              <a key={c.name} href={c.href} className="aud-card">
                <span className="aud-ring" aria-hidden="true">
                  {c.platform === "YouTube" ? <YoutubeLogo size={26} weight="fill" /> : <InstagramLogo size={26} weight="fill" />}
                </span>
                <span className="aud-num">{c.stat}</span>
                <span className="aud-what">{c.statLabel} · {c.name}</span>
                <span className="aud-desc">{c.desc}</span>
              </a>
            ))}
          </div>
          <ul className="reel">
            {rail.map((v) => (
              <li key={v.id}>
                <a href={`https://www.youtube.com/watch?v=${v.id}`}>
                  <span className="reel-pic">
                    <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt="" loading="lazy" />
                    <span className="reel-play"><Play size={16} weight="fill" aria-hidden="true" /></span>
                  </span>
                  <b>{v.title}</b>
                  <small>{views(v.views)} views{v.short ? " · Short" : ""}</small>
                </a>
              </li>
            ))}
          </ul>
          <ul className="extras">
            {educator.extras.map((x) => (
              <li key={x.href}>
                <a href={x.href}>
                  <span>{x.text}</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* ---------- contact ---------- */}
        <section id="contact" className="g-sec" aria-labelledby="contact-title">
          <div className="contact">
            <img className="contact-photo" src="/jeet.jpg" alt="Jeet Soni" />
            <div className="contact-body">
              <p className="g-label"><span>08</span>Contact</p>
              <h2 id="contact-title">Have an agent that needs to hold up in production?</h2>
              <p className="contact-sub">
                Building an agent platform, wiring AI into a product, or hunting for an engineer who treats evals as
                seriously as demos? My inbox is open.
              </p>
              <p className="contact-where">{site.location} · {site.role}</p>
              <a href={`mailto:${site.email}`} className="contact-mail">
                <span>{site.email}</span>
                <ArrowRight size={26} weight="bold" aria-hidden="true" />
              </a>
              <ul className="socials">
                <li><a href={site.socials.linkedin} aria-label="LinkedIn"><LinkedinLogo size={22} weight="fill" /></a></li>
                <li><a href={site.socials.github} aria-label="GitHub"><GithubLogo size={22} weight="fill" /></a></li>
                <li><a href={site.socials.youtube} aria-label="YouTube"><YoutubeLogo size={22} weight="fill" /></a></li>
                <li><a href={site.socials.instagram} aria-label="Instagram"><InstagramLogo size={22} weight="fill" /></a></li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <GlassFoot />
    </div>
  );
}
