import type { CountdownLabels } from "./Countdown.types.js";

export const COUNTDOWN_LABELS: CountdownLabels = {
  days: "días",
  hours: "horas",
  minutes: "min",
  seconds: "seg",
  finished: "Tiempo agotado",
  remaining: (parts) =>
    parts.days > 0
      ? `Quedan ${String(parts.days)} días y ${String(parts.hours)} horas`
      : `Quedan ${String(parts.hours)} horas y ${String(parts.minutes)} minutos`,
};
