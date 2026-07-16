/**
 * Núcleo del generador: hex semilla → escala 50–950 en OKLCH.
 * - L: curva fija por perfil (consistente entre paletas).
 * - C: campana anclada al chroma de la semilla en su paso más cercano.
 * - H: hue de la semilla, constante.
 * Todo se clampa al gamut sRGB antes de emitir hex.
 */
import { clampChroma, converter, formatHex, parse } from "culori";

import { CHROMA_MULT, SHADES, lCurveFor, type CurveProfile, type Shade } from "./curves.ts";

const toOklch = converter("oklch");

export type GeneratedScale = Record<Shade, string>;

export function generateScale(seedHex: string, profile: CurveProfile = "chromatic"): GeneratedScale {
  const parsed = parse(seedHex);
  if (parsed === undefined) {
    throw new Error(`Color semilla inválido: "${seedHex}" (se espera hex tipo #4f46e5)`);
  }
  const seed = toOklch(parsed);
  const seedL = seed.l;
  const seedC = seed.c;
  const seedH = seed.h ?? 0;

  const lCurve = lCurveFor(profile);

  // Paso cuya L es más cercana a la semilla: ahí el chroma coincide con ella.
  let anchorIndex = 0;
  let anchorDistance = Number.POSITIVE_INFINITY;
  lCurve.forEach((l, i) => {
    const distance = Math.abs(l - seedL);
    if (distance < anchorDistance) {
      anchorDistance = distance;
      anchorIndex = i;
    }
  });

  const scale = {} as GeneratedScale;
  SHADES.forEach((shade, i) => {
    const l = lCurve[i];
    if (l === undefined) {
      throw new Error(`Curva L incompleta para el perfil "${profile}" (paso ${shade})`);
    }
    const c =
      profile === "chromatic"
        ? (seedC * (CHROMA_MULT[i] ?? 0)) / (CHROMA_MULT[anchorIndex] ?? 1)
        : seedC;
    const inGamut = clampChroma({ mode: "oklch", l, c, h: seedH }, "oklch");
    scale[shade] = formatHex(inGamut);
  });
  return scale;
}

export function generateNamedScales(
  specs: readonly { name: string; seed: string; profile: CurveProfile }[],
): Record<string, GeneratedScale> {
  const out: Record<string, GeneratedScale> = {};
  for (const spec of specs) {
    out[spec.name] = generateScale(spec.seed, spec.profile);
  }
  return out;
}
