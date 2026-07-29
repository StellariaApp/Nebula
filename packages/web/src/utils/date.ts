import {
  CalendarDate,
  CalendarDateTime,
  Time,
  getLocalTimeZone,
  parseDate,
  parseDateTime,
  parseTime,
  today,
} from "@internationalized/date";
import type { DateRange } from "@stellaria/nebula-tokens";

export type DateGranularity = "day" | "minute" | "second";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_TIME = /^\d{2}:\d{2}(:\d{2})?$/;
const ISO_DATE_TIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?$/;
const ISO_MONTH = /^\d{4}-\d{2}$/;
const ISO_YEAR = /^\d{4}$/;

function Pad(value: number, length: number): string {
  return String(value).padStart(length, "0");
}

export function ParseDate(value: string | undefined | null): CalendarDate | null {
  if (typeof value !== "string" || !ISO_DATE.test(value)) return null;
  try {
    return parseDate(value);
  } catch {
    return null;
  }
}

export function ParseDateTime(value: string | undefined | null): CalendarDateTime | null {
  if (typeof value !== "string" || !ISO_DATE_TIME.test(value)) return null;
  try {
    return parseDateTime(value.replace(" ", "T"));
  } catch {
    return null;
  }
}

export function ParseTime(value: string | undefined | null): Time | null {
  if (typeof value !== "string" || !ISO_TIME.test(value)) return null;
  try {
    return parseTime(value);
  } catch {
    return null;
  }
}

export function FormatDate(value: CalendarDate | CalendarDateTime | null | undefined): string {
  if (value === null || value === undefined) return "";
  return `${Pad(value.year, 4)}-${Pad(value.month, 2)}-${Pad(value.day, 2)}`;
}

export function FormatTime(value: Time | CalendarDateTime | null | undefined, seconds = false): string {
  if (value === null || value === undefined) return "";
  const base = `${Pad(value.hour, 2)}:${Pad(value.minute, 2)}`;
  return seconds ? `${base}:${Pad(value.second, 2)}` : base;
}

export function FormatDateTime(
  value: CalendarDateTime | null | undefined,
  seconds = false,
): string {
  if (value === null || value === undefined) return "";
  return `${FormatDate(value)}T${FormatTime(value, seconds)}`;
}

export function ParseMonth(value: string | undefined | null): CalendarDate | null {
  if (typeof value !== "string" || !ISO_MONTH.test(value)) return null;
  return ParseDate(`${value}-01`);
}

export function FormatMonth(value: CalendarDate | null | undefined): string {
  if (value === null || value === undefined) return "";
  return `${Pad(value.year, 4)}-${Pad(value.month, 2)}`;
}

export function ParseYear(value: string | undefined | null): number | null {
  if (typeof value !== "string" || !ISO_YEAR.test(value)) return null;
  return Number(value);
}

export function FormatYear(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "";
  return Pad(value, 4);
}

export function TodayDate(): CalendarDate {
  return today(getLocalTimeZone());
}

export function EmptyRange(): DateRange {
  return { start: "", end: "" };
}

export function IsEmptyRange(value: DateRange | null | undefined): boolean {
  return value === null || value === undefined || (value.start === "" && value.end === "");
}
