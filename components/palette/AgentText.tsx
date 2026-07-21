"use client";

import type { ReactNode } from "react";

/**
 * Markdown-lite renderer for agent replies: paragraphs, "- " lists,
 * **bold**, `code` and bare links. Hand-rolled on purpose; a full
 * markdown dependency would outweigh the palette itself.
 */
const INLINE = /(\*\*[^*]+\*\*|`[^`]+`|https?:\/\/[^\s)]+)/g;

function renderInline(text: string): ReactNode[] {
  const parts = text.split(INLINE);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return <code key={i}>{part.slice(1, -1)}</code>;
    }
    if (part.startsWith("http://") || part.startsWith("https://")) {
      const label = part.replace(/^https?:\/\//, "").replace(/\/$/, "");
      return (
        <a key={i} href={part} target="_blank" rel="noreferrer">
          {label}
        </a>
      );
    }
    return part;
  });
}

export default function AgentText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);

  return (
    <>
      {blocks.map((block, bi) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        const isList = lines.length > 0 && lines.every((l) => /^[-*] /.test(l));

        if (isList) {
          return (
            <ul key={bi}>
              {lines.map((l, li) => (
                <li key={li}>{renderInline(l.replace(/^[-*] /, ""))}</li>
              ))}
            </ul>
          );
        }

        // mixed block: keep single newlines as breaks
        return (
          <p key={bi}>
            {lines.map((l, li) => (
              <span key={li}>
                {li > 0 && <br />}
                {renderInline(/^[-*] /.test(l) ? l.replace(/^[-*] /, "· ") : l)}
              </span>
            ))}
          </p>
        );
      })}
    </>
  );
}
