"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";

// The palette (and the AI SDK client code inside it) loads only on first
// open: visitors who never press the key download none of it.
const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });

export default function PaletteLauncher() {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  if (!open) return null;
  return <CommandPalette onClose={close} />;
}
