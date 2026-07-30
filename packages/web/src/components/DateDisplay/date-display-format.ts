import type { DateDisplayPreset } from "./DateDisplay.types.js";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

const MINUTE = 60_000;
const HOUR = 3_600_000;
const DAY = 86_400_000;
const WEEK = 604_800_000;
const MONTH = 2_629_800_000;
const YEAR = 31_557_600_000;

export const PRESETS: Record<DateDisplayPreset, Intl.DateTimeFormatOptions> = {
  date: { year: "numeric", month: "2-digit", day: "2-digit" },
  datetime: {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  },
  time: { hour: "2-digit", minute: "2-digit" },
  long: { year: "numeric", month: "long", day: "numeric" },
  short: { month: "short", day: "numeric" },
};

export function ToDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value;
  if (typeof value === "number") {
    const from_number = new Date(value);
    return Number.isNaN(from_number.getTime()) ? null : from_number;
  }
  const normalized = DATE_ONLY.test(value) ? `${value}T00:00:00` : value;
  const parsed = new Date(normalized);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function ToIso(value: Date, dateOnly: boolean): string {
  const iso = value.toISOString();
  return dateOnly ? (iso.split("T")[0] ?? iso) : iso;
}

export function IsDateOnly(value: string | number | Date | null | undefined): boolean {
  return typeof value === "string" && DATE_ONLY.test(value);
}

export function FormatAbsolute(
  value: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  try {
    return new Intl.DateTimeFormat(locale, options).format(value);
  } catch {
    return value.toISOString();
  }
}

export function FormatRelative(value: Date, locale: string, now: Date): string {
  const delta = value.getTime() - now.getTime();
  const absolute = Math.abs(delta);

  const [amount, unit]: [number, Intl.RelativeTimeFormatUnit] =
    absolute < MINUTE
      ? [delta / 1000, "second"]
      : absolute < HOUR
        ? [delta / MINUTE, "minute"]
        : absolute < DAY
          ? [delta / HOUR, "hour"]
          : absolute < WEEK
            ? [delta / DAY, "day"]
            : absolute < MONTH
              ? [delta / WEEK, "week"]
              : absolute < YEAR
                ? [delta / MONTH, "month"]
                : [delta / YEAR, "year"];

  try {
    return new Intl.RelativeTimeFormat(locale, { numeric: "auto" }).format(
      Math.round(amount),
      unit,
    );
  } catch {
    return value.toISOString();
  }
}
