import { clampChroma, converter, formatHex, parse, wcagContrast } from "culori";

import type { NebulaTheme } from "@stellaria/nebula-tokens";

import type { ContrastPair } from "./pairs.ts";
import { Composite } from "./resolve.ts";

const toOklch = converter("oklch");

export interface PairResult {
  label: string;
  fg: string;
  bg: string;
  ratio: number;
  min: number;
  pass: boolean;
  suggestion?: string | undefined;
  /** Copiada del par: si esta presente y el par falla, es deuda aceptada y no tumba el gate. */
  deuda?: string | undefined;
}

/**
 * `wcagContrast` de culori ignora el alfa: mide rgba(255,255,255,0.09) como blanco puro. Un filo
 * translúcido pasaba con 16.65 cuando su compuesto real da 1.10. Se aplana contra su fondo antes
 * de medir (ADR-102).
 */
function Flatten(color: string, backdrop: string): string {
  const parsed = parse(color);
  if (parsed === undefined) return color;
  const alpha = parsed.alpha ?? 1;
  if (alpha >= 1) return color;
  return Composite(color, backdrop);
}

export function SuggestFix(fg: string, bg: string, min: number): string | undefined {
  const parsed = parse(fg);
  if (parsed === undefined) return undefined;
  const base = toOklch(parsed);

  for (let delta = 0.005; delta <= 1; delta += 0.005) {
    for (const direction of [-1, 1]) {
      const l = base.l + direction * delta;
      if (l < 0 || l > 1) continue;
      const candidate = clampChroma({ mode: "oklch", l, c: base.c, h: base.h ?? 0 }, "oklch");
      const hex = formatHex(candidate);
      if (wcagContrast(hex, bg) >= min) return hex;
    }
  }
  return undefined;
}

export function CheckTheme(theme: NebulaTheme, pairs: readonly ContrastPair[]): PairResult[] {
  const applicable = pairs.filter((pair) => pair.skip?.(theme) !== true);
  return applicable.map((pair) => {
    const fg = Flatten(pair.fg(theme), Flatten(pair.bg(theme), theme.colors.surface.base));
    const bg = Flatten(pair.bg(theme), theme.colors.surface.base);
    const ratio = wcagContrast(fg, bg);
    const pass = ratio >= pair.min;
    return {
      label: pair.label,
      fg,
      bg,
      ratio,
      min: pair.min,
      pass,
      suggestion: pass ? undefined : SuggestFix(fg, bg, pair.min),
      deuda: pair.deuda,
    };
  });
}
