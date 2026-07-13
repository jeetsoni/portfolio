"use client";

import { useMemo, useState } from "react";
import channelFeed from "@/lib/channel-feed.json";
import { site } from "@/lib/data";

/**
 * An ink "control-room monitor" inside the bone section: plays real channel
 * uploads inline. Nothing loads until the visitor presses play — posters are
 * plain ytimg thumbnails, the YouTube iframe mounts only on demand.
 * lib/channel-feed.json is re-snapshotted from the channel RSS on every build.
 */

type Video = {
  id: string;
  title: string;
  short: boolean;
  published: string;
  views: number;
};

const fmtViews = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, "")}K` : String(n);

const fmtDate = (iso: string) =>
  new Date(iso)
    .toLocaleDateString("en-US", { month: "short", day: "numeric" })
    .toUpperCase();

export default function BroadcastDeck() {
  // deep dives and shorts kept as distinct groups, each most-watched first
  const { deepDives, shorts, queue } = useMemo(() => {
    const vids = channelFeed.videos as Video[];
    const deepDives = vids.filter((v) => !v.short).sort((a, b) => b.views - a.views);
    const shorts = vids.filter((v) => v.short).sort((a, b) => b.views - a.views);
    return { deepDives, shorts, queue: [...deepDives, ...shorts] };
  }, []);

  const [active, setActive] = useState<Video>(queue[0]);
  const [playing, setPlaying] = useState(false);

  return (
    <div className="edu-deck mt-14 border border-ink/15 bg-ink text-bone">
      {/* status strip */}
      <div className="flex items-center justify-between border-b border-bone/10 px-4 py-3 md:px-6">
        <p className="font-mono text-[0.675rem] uppercase tracking-[0.22em] text-bone-dim">
          SynapByte · Broadcast
        </p>
        <p className="flex items-center gap-2 font-mono text-[0.675rem] uppercase tracking-[0.22em] text-signal">
          <span className="live-dot h-1.5 w-1.5 rounded-full bg-signal" />
          On Air
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr]">
        {/* theater */}
        <div>
          <div className="relative aspect-video overflow-hidden bg-black">
            {playing ? (
              <iframe
                key={active.id}
                src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1&rel=0&playsinline=1`}
                title={active.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            ) : (
              <button
                type="button"
                data-cursor
                onClick={() => setPlaying(true)}
                aria-label={`Play ${active.title}`}
                className="group absolute inset-0 w-full"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://i.ytimg.com/vi/${active.id}/maxresdefault.jpg`}
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.src.endsWith("hqdefault.jpg")) {
                      img.src = `https://i.ytimg.com/vi/${active.id}/hqdefault.jpg`;
                    }
                  }}
                  alt={active.title}
                  className="h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
                />
                <span className="absolute inset-0 grid place-items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-signal text-ink transition-transform duration-300 group-hover:scale-110">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                      <path d="M5 3l12 7-12 7V3z" />
                    </svg>
                  </span>
                </span>
              </button>
            )}
          </div>
          <div className="flex items-start justify-between gap-4 px-4 py-4 md:px-6">
            <div>
              <p className="font-sans font-bold leading-snug">{active.title}</p>
              <p className="mt-1 font-mono text-[0.6rem] uppercase tracking-[0.18em] text-bone-dim">
                {active.short ? "Short · " : "Deep dive · "}
                {fmtViews(active.views)} views · {fmtDate(active.published)}
              </p>
            </div>
            <a
              href={`https://www.youtube.com/watch?v=${active.id}`}
              target="_blank"
              rel="noreferrer"
              className="mono-label shrink-0 whitespace-nowrap transition-colors hover:text-signal"
            >
              YouTube ↗
            </a>
          </div>
        </div>

        {/* queue */}
        <aside className="flex min-h-0 flex-col border-t border-bone/10 lg:border-l lg:border-t-0">
          {/* on lg the scroller fills the aside absolutely so the queue's
              content height can't stretch the grid row past the theater */}
          <div className="lg:relative lg:min-h-0 lg:flex-1">
            <div className="card-scroll max-h-[320px] overflow-y-auto lg:absolute lg:inset-0 lg:max-h-none">
              <p className="mono-label px-4 pb-2 pt-4">Deep dives</p>
              {deepDives.map((v) => (
                <QueueRow key={v.id} v={v} active={active.id === v.id} onSelect={() => { setActive(v); setPlaying(true); }} />
              ))}
              <p className="mono-label px-4 pb-2 pt-5">Shorts</p>
              {shorts.map((v) => (
                <QueueRow key={v.id} v={v} active={active.id === v.id} onSelect={() => { setActive(v); setPlaying(true); }} />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* cross-post strip */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-bone/10 px-4 py-3 md:px-6">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-bone-dim">
          Cross-posted as reels on Instagram
        </p>
        <div className="flex gap-5">
          <a
            href={site.socials.synapbyte}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors hover:text-signal"
          >
            @synap_byte ↗
          </a>
          <a
            href={site.socials.instagram}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors hover:text-signal"
          >
            @jeetsoni.ai ↗
          </a>
          <a
            href={site.socials.youtube}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-signal transition-colors hover:text-signal-soft"
          >
            Subscribe ↗
          </a>
        </div>
      </div>
    </div>
  );
}

function QueueRow({
  v,
  active,
  onSelect,
}: {
  v: Video;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      data-cursor
      onClick={onSelect}
      className={`group flex w-full items-center gap-3 border-l-2 px-3 py-2.5 text-left transition-colors ${
        active ? "border-signal bg-bone/5" : "border-transparent hover:bg-bone/5"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-11 w-[74px] shrink-0 object-cover"
      />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 text-xs leading-snug text-bone">{v.title}</span>
        <span className="mt-1 flex gap-2.5 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-bone-dim">
          <span>{fmtViews(v.views)} views</span>
        </span>
      </span>
    </button>
  );
}
