import { gateway } from "@ai-sdk/gateway";
import {
  convertToModelMessages,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { AGENT_SYSTEM } from "@/lib/agent/knowledge";
import { checkRateLimit, clientIp } from "@/lib/agent/rate-limit";

export const maxDuration = 60;

const SECTIONS = ["top", "about", "experience", "work", "channel", "contact"] as const;
const PROJECT_SLUGS = ["kalpana-ai", "dicom-viewer", "redline-agent", "agentos", "view-com-au"] as const;
const CASE_STUDIES = ["kalpana-ai", "dicom-viewer"] as const;

/**
 * Tools carry deliberately NO execute handlers: the loop stops after each
 * model turn and the visitor's browser performs the action against the
 * page, then posts the result back. Same architecture as the DICOM
 * viewer's agentic reader, on purpose.
 */
const tools = {
  go_to_section: tool({
    description:
      "Scroll the visitor's page to a section of the portfolio. Sections: top (hero), about, experience (work history), work (selected builds / projects), channel (teaching, videos), contact.",
    inputSchema: z.object({
      section: z.enum(SECTIONS).describe("The section to scroll to"),
    }),
  }),
  show_project: tool({
    description:
      "Slide the Selected Builds rail to one specific project card and highlight it. Use when discussing or pointing at a single project.",
    inputSchema: z.object({
      slug: z.enum(PROJECT_SLUGS).describe("The project to show"),
    }),
  }),
  open_case_study: tool({
    description:
      "Navigate the visitor to a full engineering case study page on this site. Only KalpanaAI and the DICOM Viewer + PACS have case studies.",
    inputSchema: z.object({
      slug: z.enum(CASE_STUDIES).describe("Which case study to open"),
    }),
  }),
};

const MAX_MESSAGES = 16;
const MAX_TEXT_LENGTH = 2_000;

export async function POST(req: Request) {
  if (!process.env.AI_GATEWAY_API_KEY) {
    return Response.json(
      { error: "agent_not_configured" },
      { status: 503 }
    );
  }

  const limit = checkRateLimit(clientIp(req));
  if (!limit.ok) {
    return Response.json(
      { error: "rate_limited" },
      { status: 429, headers: { "retry-after": String(limit.retryAfterS) } }
    );
  }

  let messages: UIMessage[];
  try {
    const body = (await req.json()) as { messages?: UIMessage[] };
    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      return Response.json({ error: "bad_request" }, { status: 400 });
    }
    messages = body.messages.slice(-MAX_MESSAGES);
    const oversized = messages.some((m) =>
      (m.parts ?? []).some(
        (p) => p.type === "text" && p.text.length > MAX_TEXT_LENGTH
      )
    );
    if (oversized) {
      return Response.json({ error: "message_too_long" }, { status: 413 });
    }
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const result = streamText({
    // deepseek-v4-flash passed the tool-call + injection smoke probes at
    // roughly a tenth of Haiku's price (scripts/agent-model-smoke.mjs);
    // AGENT_MODEL swaps it for anything the gateway serves, no deploy.
    model: gateway(process.env.AGENT_MODEL ?? "deepseek/deepseek-v4-flash"),
    system: AGENT_SYSTEM,
    messages: await convertToModelMessages(messages),
    tools,
    maxOutputTokens: 400,
  });

  return result.toUIMessageStreamResponse();
}
