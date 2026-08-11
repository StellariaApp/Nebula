export const INK_LIGHT = "#ffffff";
export const INK_DARK = "#0b0b0b";
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

function Ratio(a: number, b: number): number {
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function Contrast(a: string, b: string): number {
  return Ratio(Luminance(a), Luminance(b));
}

export function WorstInk(stops: readonly string[], floor: number): string {
  let light = Number.POSITIVE_INFINITY;
  let dark = Number.POSITIVE_INFINITY;
  for (const stop of stops) {
    light = Math.min(light, Contrast(stop, INK_LIGHT));
    dark = Math.min(dark, Contrast(stop, INK_DARK));
  }
  return light >= floor || light >= dark ? INK_LIGHT : INK_DARK;
}

export function OnColor(concrete: string | null, floor: number): string {
  if (concrete === null) return INK_LIGHT;
  const fill = Luminance(concrete);
  const light = Ratio(fill, Luminance(INK_LIGHT));
  const dark = Ratio(fill, Luminance(INK_DARK));
  return light >= floor || light >= dark ? INK_LIGHT : INK_DARK;
}
