import { clampChroma, converter, formatHex, parse, wcagContrast } from "culori";

import type { NebulaTheme } from "@stellaria/nebula-tokens";

import type { ContrastPair } from "./pairs.ts";

const toOklch = converter("oklch");

export interface PairResult {
  label: string;
  fg: string;
  bg: string;
  ratio: number;
  min: number;
  pass: boolean;
  suggestion?: string | undefined;
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
  return pairs.map((pair) => {
    const fg = pair.fg(theme);
    const bg = pair.bg(theme);
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
    };
  });
}
