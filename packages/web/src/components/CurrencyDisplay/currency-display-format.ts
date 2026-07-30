import type { CurrencySign } from "./CurrencyDisplay.types.js";

export interface CurrencyFormatInput {
  amount: number;
  locale: string;
  currency: string;
  decimals: number | undefined;
  sign: CurrencySign;
  compact: boolean;
  hideSymbol: boolean;
}

export function ToAmount(raw: number | string | null | undefined): number | null {
  if (raw === null || raw === undefined || raw === "") return null;
  const parsed = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function FormatCurrency(input: CurrencyFormatInput): string {
  const { amount, locale, currency, decimals, sign, compact, hideSymbol } = input;

  const options: Intl.NumberFormatOptions = {
    style: hideSymbol ? "decimal" : "currency",
    currency,
    signDisplay: sign === "accounting" ? "auto" : sign,
    ...(sign === "accounting" ? { currencySign: "accounting" as const } : {}),
    ...(compact ? { notation: "compact" as const } : {}),
    ...(decimals === undefined
      ? {}
      : { minimumFractionDigits: decimals, maximumFractionDigits: decimals }),
  };

  try {
    return new Intl.NumberFormat(locale, options).format(amount);
  } catch {
    return amount.toFixed(decimals ?? 2);
  }
}
