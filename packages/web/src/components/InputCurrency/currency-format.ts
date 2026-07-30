export function DecimalSeparator(locale: string): string {
  try {
    const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
    return parts.find((part) => part.type === "decimal")?.value ?? ".";
  } catch {
    return ".";
  }
}

export function ParseAmount(raw: string, locale: string): number {
  const separator = DecimalSeparator(locale);
  const negative = raw.trim().startsWith("-");
  const kept = raw.replace(/[^\d.,]/g, "");
  const normalized =
    separator === ","
      ? kept.replace(/\./g, "").replace(",", ".")
      : kept.replace(/,/g, "");
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) return Number.NaN;
  return negative ? -parsed : parsed;
}

export function FormatAmount(
  value: number,
  locale: string,
  currency: string,
  precision: number | undefined,
): string {
  if (!Number.isFinite(value)) return "";
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      ...(precision === undefined
        ? {}
        : { minimumFractionDigits: precision, maximumFractionDigits: precision }),
    }).format(value);
  } catch {
    return String(value);
  }
}
