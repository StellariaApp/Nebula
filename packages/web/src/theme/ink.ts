export const LUMINANCE_DARK_THRESHOLD = 0.7;

const INK_LIGHT = "#ffffff";
const INK_DARK = "#0b0b0b";
const SRGB_CUT = 0.03928;

export function Luminance(hex: string): number {
  const raw = hex.replace("#", "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((c) => c + c)
          .join("")
      : raw;
  const channel = (start: number): number => {
    const value = Number.parseInt(full.slice(start, start + 2), 16) / 255;
    return value <= SRGB_CUT ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

export function OnColor(concrete: string | null): string {
  if (concrete === null) return INK_LIGHT;
  return Luminance(concrete) < LUMINANCE_DARK_THRESHOLD ? INK_LIGHT : INK_DARK;
}
