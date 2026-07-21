export default function SectionHeading({
  label,
  className = "mb-12 md:mb-16",
}: {
  label: string;
  /** margin override — pinned sections need a tighter stack than the default */
  className?: string;
}) {
  return (
    <h2
      className={`font-display text-2xl font-extrabold uppercase tracking-[0.05em] text-bone md:text-3xl ${className}`}
    >
      {label}
    </h2>
  );
}
