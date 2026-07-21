"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import {
  buildActions,
  executeAgentTool,
  fuzzyScore,
  type PaletteAction,
} from "@/lib/palette/actions";
import AgentText from "./AgentText";

const STARTERS = [
  "What has Jeet shipped in production?",
  "Walk me through the DICOM PACS project",
  "Does he actually know RAG?",
  "How does this palette work?",
];

function chipLabel(toolName: string, output: unknown): string {
  const did = (output as { did?: string } | undefined)?.did;
  if (did) return did;
  return toolName.replaceAll("_", " ");
}

export default function CommandPalette({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [mode, setMode] = useState<"command" | "chat">("command");
  const [notice, setNotice] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error, addToolResult } = useChat({
    transport: new DefaultChatTransport({ api: "/api/agent" }),
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onToolCall: async ({ toolCall }) => {
      const result = executeAgentTool(
        toolCall.toolName,
        (toolCall as { input?: unknown }).input
      );
      void addToolResult({
        tool: toolCall.toolName as "go_to_section",
        toolCallId: toolCall.toolCallId,
        output: result,
      });
    },
  });

  const actions = useMemo(
    () =>
      buildActions((note) => {
        setNotice(note);
        window.setTimeout(onClose, 160);
      }),
    [onClose]
  );

  const filtered = useMemo(() => {
    const scored = actions
      .map((a) => ({ a, s: fuzzyScore(query, a) }))
      .filter(({ s }) => s > 0)
      .sort((x, y) => y.s - x.s)
      .map(({ a }) => a);
    // empty query shows a short list so the ask-the-agent section stays
    // fully visible without scrolling; typing surfaces everything else
    return scored.slice(0, query.trim() ? 9 : 5);
  }, [actions, query]);

  // rows: actions plus one "ask the agent" row whenever there is a query
  const askRow = query.trim().length > 0;
  const rowCount = filtered.length + (askRow ? 1 : 0);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // No scroll lock on purpose: the agent's tools scroll the page behind
  // the scrim while it talks; data-lenis-prevent keeps wheel input inside
  // the panel from fighting the smooth scroller.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, status]);

  const ask = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMode("chat");
    setQuery("");
    void sendMessage({ text: q });
  };

  const runRow = (index: number) => {
    if (askRow && index === filtered.length) {
      ask(query);
      return;
    }
    const action: PaletteAction | undefined = filtered[index];
    action?.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
      return;
    }
    if (mode === "chat") {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (status === "ready" || status === "error") ask(query);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, rowCount - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (rowCount > 0) runRow(active);
      else if (query.trim()) ask(query);
    }
  };

  const busy = status === "submitted" || status === "streaming";
  const errorLine = error
    ? String(error.message ?? "").includes("429") || String(error.message ?? "").includes("rate_limited")
      ? "One moment: too many questions at once. Try again shortly."
      : "The agent is offline right now. The commands above still work."
    : null;

  return (
    <div
      className="palette-scrim"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="palette-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Site command palette and agent"
        data-lenis-prevent
        onKeyDown={onKeyDown}
      >
        <div className="palette-input-row">
          {mode === "chat" && (
            <button
              type="button"
              className="palette-back"
              onClick={() => setMode("command")}
              aria-label="Back to commands"
            >
              ←
            </button>
          )}
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              mode === "chat"
                ? "Ask a follow-up..."
                : "Type a command, or ask about Jeet..."
            }
            aria-label="Palette input"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd>ESC</kbd>
        </div>

        {mode === "command" ? (
          <>
            <div className="palette-list" ref={listRef} role="listbox" aria-label="Commands">
              {filtered.map((a, i) => (
                <button
                  key={a.id}
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  data-active={i === active || undefined}
                  className="palette-item"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => runRow(i)}
                >
                  <span>{a.label}</span>
                  <span className="palette-hint">{a.hint}</span>
                </button>
              ))}

              {askRow && (
                <button
                  type="button"
                  role="option"
                  aria-selected={active === filtered.length}
                  data-active={active === filtered.length || undefined}
                  className="palette-item palette-item-ask"
                  onMouseEnter={() => setActive(filtered.length)}
                  onClick={() => ask(query)}
                >
                  <span>
                    Ask the agent: <em>{query.trim()}</em>
                  </span>
                  <span className="palette-hint">Agent</span>
                </button>
              )}
            </div>

            {!query.trim() && (
              <div className="palette-starters">
                <p>Or ask the agent</p>
                {STARTERS.map((s) => (
                  <button key={s} type="button" onClick={() => ask(s)}>
                    {s} <span aria-hidden="true">→</span>
                  </button>
                ))}
              </div>
            )}
            {notice && <p className="palette-notice">{notice}</p>}
          </>
        ) : (
          <div className="palette-chat" aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "palette-msg-user" : "palette-msg-agent"}>
                {m.parts.map((part, i) => {
                  if (part.type === "text") {
                    return m.role === "user" ? (
                      <p key={i}>{part.text}</p>
                    ) : (
                      <AgentText key={i} text={part.text} />
                    );
                  }
                  if (part.type.startsWith("tool-")) {
                    const toolPart = part as {
                      type: string;
                      state?: string;
                      output?: unknown;
                    };
                    if (toolPart.state === "output-available") {
                      return (
                        <span key={i} className="palette-chip">
                          → {chipLabel(part.type.slice(5), toolPart.output)}
                        </span>
                      );
                    }
                    return null;
                  }
                  return null;
                })}
              </div>
            ))}
            {busy && <p className="palette-thinking">thinking</p>}
            {errorLine && <p className="palette-error">{errorLine}</p>}
            <div ref={chatEndRef} />
          </div>
        )}

        <div className="palette-foot">
          <span>AI agent: verify anything important</span>
          <a href="/work/dicom-viewer/">
            Server plans, your browser executes. Same pattern as the DICOM reader
          </a>
        </div>
      </div>
    </div>
  );
}
