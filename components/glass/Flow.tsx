import {
  Archive,
  ChatCenteredText,
  Cpu,
  Database,
  FileText,
  Gauge,
  HardDrives,
  Monitor,
  Plugs,
  Queue,
  Scan,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";
import type { FlowStep, Kind } from "./flows";

const ICONS: Record<Kind, typeof Cpu> = {
  input: ChatCenteredText,
  doc: FileText,
  agent: Cpu,
  check: ShieldCheck,
  queue: Queue,
  db: Database,
  store: Archive,
  screen: Monitor,
  device: Scan,
  gateway: HardDrives,
  gauge: Gauge,
  hub: Plugs,
};

/**
 * How a project runs: solid step chips joined by beams with light moving
 * along them. Horizontal from tablet up, vertical on phones. The step that
 * makes the system hard is lit amber and carries the note.
 */
export default function Flow({ steps, note, title }: { steps: FlowStep[]; note: string; title: string }) {
  return (
    <ol className="flow" aria-label={`How ${title} runs`} style={{ ["--n" as string]: steps.length }}>
      {steps.map((s, i) => {
        const Icon = ICONS[s.kind];
        return (
          <li key={s.label} data-hot={s.hot ? "1" : "0"} style={{ ["--i" as string]: i }}>
            <span className="flow-icon">
              <Icon size={22} weight={s.hot ? "fill" : "duotone"} aria-hidden="true" />
            </span>
            <span className="flow-text">
              <b>{s.label}</b>
              {s.note && <small>{s.note}</small>}
              {s.hot && <em>{note}</em>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
