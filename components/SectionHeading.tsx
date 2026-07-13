export default function SectionHeading({
  index,
  label,
  tone = "dark",
  className = "mb-12 md:mb-16",
}: {
  index: string;
  label: string;
  tone?: "dark" | "light";
  /** margin override — pinned sections need a tighter stack than the default */
  className?: string;
}) {
  const light = tone === "light";
  return (
    <div className={`flex items-baseline gap-4 ${className}`}>
      <span className="font-mono text-lg font-bold text-signal">{index}</span>
      <span className="h-px w-10 self-center bg-signal/60" />
      <span
        className={`font-mono text-[0.675rem] uppercase tracking-[0.22em] ${
          light ? "text-ink/55" : "text-bone-dim"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
