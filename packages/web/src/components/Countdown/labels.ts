import type { CountdownLabels } from "./Countdown.types.js";

export const COUNTDOWN_LABELS: CountdownLabels = {
  days: "days",
  hours: "hours",
  minutes: "min",
  seconds: "sec",
  finished: "Time is up",
  remaining: (parts) =>
    parts.days > 0
      ? `${String(parts.days)} days and ${String(parts.hours)} hours left`
      : `${String(parts.hours)} hours and ${String(parts.minutes)} minutes left`,
};
