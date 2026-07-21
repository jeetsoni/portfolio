"use client";

/** Small "Ask" chip that opens the palette; used in the nav bars. */
export default function PaletteTrigger({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event("palette:open"))}
    >
      Ask <kbd className="palette-kbd">⌘K</kbd>
    </button>
  );
}
