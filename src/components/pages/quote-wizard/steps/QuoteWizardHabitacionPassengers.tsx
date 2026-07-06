import { getRulePassengerLines } from "@/utils/cotizacionRules";
import type { RoomRule } from "@/interfaces/cotizacion-components";

export function PassengerIcons({ rule }: { rule: RoomRule }) {
  const icons: { key: string; label: string; icon: string; tone: string }[] = [];

  for (let i = 0; i < (rule.adt ?? 0); i += 1) {
    icons.push({
      key: `adt-${i}`,
      label: "ADT",
      icon: "fa-user",
      tone: "adt",
    });
  }
  for (let i = 0; i < (rule.inf ?? 0); i += 1) {
    icons.push({
      key: `inf-${i}`,
      label: "INF",
      icon: "fa-baby-carriage",
      tone: "inf",
    });
  }
  for (let i = 0; i < (rule.mnrA ?? 0); i += 1) {
    icons.push({
      key: `mnr-${i}`,
      label: "MNR1",
      icon: "fa-child",
      tone: "mnr",
    });
  }

  return (
    <div className="d-flex flex-wrap gap-2 mb-2">
      {icons.map((item) => (
        <span
          key={item.key}
          className={`tg-quote-wizard-pax-icon tg-quote-wizard-pax-icon--${item.tone}`}
          title={item.label}
        >
          <i className={`fas ${item.icon}`} aria-hidden />
          <span className="tg-quote-wizard-pax-icon-label">{item.label}</span>
        </span>
      ))}
    </div>
  );
}

export function RulePassengerDescriptions({ rule }: { rule: RoomRule }) {
  const lines = getRulePassengerLines(rule);

  return (
    <div className="small">
      {lines.map((line) => (
        <p key={line.code} className="mb-1">
          <strong>{line.code}</strong>
          {line.label.replace(line.code, "")}
        </p>
      ))}
    </div>
  );
}
