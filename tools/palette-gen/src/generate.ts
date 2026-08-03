import { clampChroma, converter, formatHex, parse } from "culori";

import { CHROMA_MULT, LCurveFor, SHADES, type CurveProfile, type Shade } from "./curves.ts";

const TO_OKLCH = converter("oklch");

const FILL_SHADE: Shade = "500";
const FILL_INK = "#ffffff";
const FILL_CONTRAST = 4.5;
const SOLVE_STEP = 0.0025;
const FILL_GAP = 0.04;

function Relative(hex: string): number {
  const raw = hex.replace("#", "");
  const channel = (start: number): number => {
    const value = Number.parseInt(raw.slice(start, start + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
}

function AgainstInk(hex: string): number {
  const a = Relative(hex);
  const b = Relative(FILL_INK);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export type GeneratedScale = Record<Shade, string>;

export function GenerateScale(
  seedHex: string,
  profile: CurveProfile = "chromatic",
): GeneratedScale {
  const parsed = parse(seedHex);
  if (parsed === undefined) {
    throw new Error(`Color semilla inválido: "${seedHex}" (se espera hex tipo #4f46e5)`);
  }
  const seed = TO_OKLCH(parsed);
  const seed_hue = seed.h ?? 0;
  const l_curve = LCurveFor(profile);

  let anchor_index = 0;
  let anchor_distance = Number.POSITIVE_INFINITY;
  l_curve.forEach((l, i) => {
    const distance = Math.abs(l - seed.l);
    if (distance < anchor_distance) {
      anchor_distance = distance;
      anchor_index = i;
    }
  });

  const scale = {} as GeneratedScale;
  SHADES.forEach((shade, i) => {
    const l = l_curve[i];
    if (l === undefined) {
      throw new Error(`Curva L incompleta para el perfil "${profile}" (paso ${shade})`);
    }
    const c =
      profile === "chromatic"
        ? (seed.c * (CHROMA_MULT[i] ?? 0)) / (CHROMA_MULT[anchor_index] ?? 1)
        : seed.c;
    const At = (lightness: number): string =>
      formatHex(clampChroma({ mode: "oklch", l: lightness, c, h: seed_hue }, "oklch"));

    if (profile !== "chromatic" || shade !== FILL_SHADE) {
      scale[shade] = At(l);
      return;
    }

    const floor = (l_curve[i + 1] ?? 0) + FILL_GAP;
    let solved = l;
    while (solved > floor && AgainstInk(At(solved)) < FILL_CONTRAST) solved -= SOLVE_STEP;
    scale[shade] = At(solved);
  });
  return scale;
}

export function GenerateNamedScales(
  specs: readonly { name: string; seed: string; profile: CurveProfile }[],
): Record<string, GeneratedScale> {
  const out: Record<string, GeneratedScale> = {};
  for (const spec of specs) {
    out[spec.name] = GenerateScale(spec.seed, spec.profile);
  }
  return out;
}
