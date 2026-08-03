import { converter, formatHex, parse } from "culori";

import type {
  NebulaTheme,
  SemanticScaleName,
  Variant,
  VariantBackground,
  VariantRecipe,
} from "@stellaria/nebula-tokens";

const toRgb = converter("rgb");

export const SEMANTIC_SCALES: readonly SemanticScaleName[] = [
  "primary",
  "accent",
  "gray",
  "success",
  "warning",
  "error",
  "info",
];

export class UnsupportedRefError extends Error {
  constructor(ref: string) {
    super(`Referencia de color no soportada por contrast-check: "${ref}"`);
    this.name = "UnsupportedRefError";
  }
}

function ScaleOf(theme: NebulaTheme, scale: SemanticScaleName): Record<string, string> {
  switch (scale) {
    case "primary":
      return theme.colors.primary;
    case "accent":
      return theme.colors.accent;
    case "gray":
      return theme.colors.gray;
    default:
      return theme.colors.semantic[scale];
  }
}

export function Composite(color: string, backdrop: string, alpha?: number): string {
  const top = toRgb(parse(color));
  const under = toRgb(parse(backdrop));
  if (top === undefined) throw new UnsupportedRefError(color);
  if (under === undefined) throw new UnsupportedRefError(backdrop);
  const a = alpha ?? top.alpha ?? 1;
  if (a >= 1) return formatHex({ ...top, alpha: 1 });
  return formatHex({
    mode: "rgb",
    r: top.r * a + under.r * (1 - a),
    g: top.g * a + under.g * (1 - a),
    b: top.b * a + under.b * (1 - a),
  });
}

export function ResolveRef(
  theme: NebulaTheme,
  ref: string,
  scale: SemanticScaleName,
  backdrop: string,
): string | null {
  if (ref === "transparent") return backdrop;
  if (ref === "currentColor" || ref === "none") return null;

  const [group, key, alpha] = ref.split(".");
  if (group === undefined || key === undefined) throw new UnsupportedRefError(ref);

  if (group === "scale") {
    const base = ScaleOf(theme, scale)[key];
    if (base === undefined) throw new UnsupportedRefError(ref);
    return alpha === undefined ? base : Composite(base, backdrop, Number(alpha) / 100);
  }
  if (group === "surface")
    return theme.colors.surface[key as keyof NebulaTheme["colors"]["surface"]];
  if (group === "text") return theme.colors.text[key as keyof NebulaTheme["colors"]["text"]];
  if (group === "border") return theme.colors.border[key as keyof NebulaTheme["colors"]["border"]];

  throw new UnsupportedRefError(ref);
}

const SHADES = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
  "950",
] as const;

/** Réplica de `ShiftRef` de `packages/web/src/theme/resolve-variant.ts`: el hover sube un peldaño. */
export function ShiftRef(ref: VariantBackground, steps: number): VariantBackground {
  const [group, key, alpha] = ref.split(".");
  if (group !== "scale" || key === undefined) return ref;
  const index = (SHADES as readonly string[]).indexOf(key);
  if (index < 0) return ref;
  const next = SHADES[Math.min(SHADES.length - 1, Math.max(0, index + steps))];
  if (next === undefined) return ref;
  return (alpha === undefined ? `scale.${next}` : `scale.${next}.${alpha}`) as VariantBackground;
}

export interface ResolvedSurface {
  bg: string;
  detail: string;
}

export function ResolveBackground(
  theme: NebulaTheme,
  variant: Variant,
  recipe: VariantRecipe,
  scale: SemanticScaleName,
  foreground: string,
): ResolvedSurface | null {
  const backdrop = theme.colors.surface.base;

  if (recipe.glass !== undefined && theme.effects.glass.enabled) {
    const surface = theme.effects.glass.surface[recipe.glass];
    return { bg: Composite(surface.background, backdrop), detail: `glass ${recipe.glass}` };
  }

  if (recipe.background.startsWith("gradient.")) {
    const role = recipe.background.slice("gradient.".length);
    const token = theme.effects.gradients[role as keyof NebulaTheme["effects"]["gradients"]];
    if (token === undefined) throw new UnsupportedRefError(recipe.background);
    let worst: { bg: string; ratio: number } | null = null;
    for (const stop of token.stops) {
      const bg = Composite(stop.color, backdrop);
      const ratio = Ratio(foreground, bg);
      if (worst === null || ratio < worst.ratio) worst = { bg, ratio };
    }
    if (worst === null) throw new UnsupportedRefError(recipe.background);
    return { bg: worst.bg, detail: `gradient.${role} peor stop` };
  }

  const bg = ResolveRef(theme, recipe.background, scale, backdrop);
  if (bg === null) return null;
  return { bg, detail: variant };
}

function Luminance(hex: string): number {
  const rgb = toRgb(parse(hex));
  if (rgb === undefined) throw new UnsupportedRefError(hex);
  const channel = (v: number): number =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  return 0.2126 * channel(rgb.r) + 0.7152 * channel(rgb.g) + 0.0722 * channel(rgb.b);
}

/** Réplica de `OnColor` de `packages/web/src/theme/ink.ts`: gana la tinta que más contrasta. */
export function OnColor(fill: string): string {
  return Ratio(fill, "#ffffff") >= Ratio(fill, "#0b0b0b") ? "#ffffff" : "#0b0b0b";
}

export function Ratio(a: string, b: string): number {
  const la = Luminance(a);
  const lb = Luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
