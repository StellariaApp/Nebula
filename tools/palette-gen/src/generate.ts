import { clampChroma, converter, formatHex, parse } from "culori";

import { CHROMA_MULT, LCurveFor, SHADES, type CurveProfile, type Shade } from "./curves.ts";

const TO_OKLCH = converter("oklch");

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
    scale[shade] = formatHex(clampChroma({ mode: "oklch", l, c, h: seed_hue }, "oklch"));
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
