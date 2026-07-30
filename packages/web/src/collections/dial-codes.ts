import { DIAL_CODES } from "./dial-codes.data.js";

const FLAG_CDN = "https://cdn.jsdelivr.net/npm/country-flag-emoji-json@2.0.0/dist/images";
const REGIONAL_A = 0x1f1e6;
const LETTER_A = 65;

export interface DialOption {
  code: string;
  dial: string;
}

export function DialCodes(): DialOption[] {
  return DIAL_CODES.map(([code, dial]) => ({ code, dial }));
}

export function DialByCode(code: string): DialOption | undefined {
  const found = DIAL_CODES.find(([entry]) => entry === code.toUpperCase());
  return found === undefined ? undefined : { code: found[0], dial: found[1] };
}

export function FlagEmoji(code: string): string {
  const upper = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return "";
  return String.fromCodePoint(
    ...[...upper].map((letter) => REGIONAL_A + letter.charCodeAt(0) - LETTER_A),
  );
}

export function FlagImageUrl(code: string): string {
  return `${FLAG_CDN}/${code.toUpperCase()}.svg`;
}

export function CountryNamer(locale: string): (code: string) => string {
  let names: Intl.DisplayNames | null = null;
  try {
    names = new Intl.DisplayNames([locale], { type: "region" });
  } catch {
    names = null;
  }
  return (code) => {
    const upper = code.toUpperCase();
    if (names === null) return upper;
    try {
      return names.of(upper) ?? upper;
    } catch {
      return upper;
    }
  };
}

export function CountryName(code: string, locale: string): string {
  return CountryNamer(locale)(code);
}
