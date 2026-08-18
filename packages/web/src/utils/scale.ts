import { palettes, type ColorExtended, type SemanticScaleName } from "@stellaria/nebula-tokens";

import { vars } from "@stellaria/nebula-themes/web";

export const SEMANTIC_SCALES: Record<SemanticScaleName, Record<string, string>> = {
  primary: vars.color.primary,
  accent: vars.color.accent,
  gray: vars.color.gray,
  success: vars.color.semantic.success,
  warning: vars.color.semantic.warning,
  error: vars.color.semantic.error,
  info: vars.color.semantic.info,
};

const ROLES: Record<string, Record<string, string>> = {
  surface: vars.color.surface,
  text: vars.color.text,
  border: vars.color.border,
};

export function ScaleShade(color: SemanticScaleName, shade: string): string {
  return SEMANTIC_SCALES[color][shade] ?? "";
}

function WithAlpha(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${String(percent)}%, transparent)`;
}

function ApplyAlpha(color: string, alpha: string | undefined): string {
  if (alpha === undefined) return color;
  const parsed = Number(alpha);
  return Number.isFinite(parsed) ? WithAlpha(color, parsed) : color;
}

export function ResolveAccent(color: ColorExtended, shade = "600"): string {
  if (color === "transparent" || color === "currentColor" || color === "inherit") return color;
  if (color === "white") return "#ffffff";
  if (color === "black") return "#000000";
  if (color.startsWith("#")) return color;

  const [group, key, alpha] = color.split(".");
  if (group === undefined) return "transparent";

  const role = ROLES[group];
  if (role !== undefined) {
    const tone = key === undefined ? undefined : role[key];
    return tone === undefined ? "transparent" : ApplyAlpha(tone, alpha);
  }

  const step = key ?? shade;
  const scale = SEMANTIC_SCALES[group as SemanticScaleName] as Record<string, string> | undefined;
  const base =
    scale !== undefined
      ? (scale[key === undefined ? shade : step] ?? "")
      : group in palettes
        ? ((palettes[group as keyof typeof palettes] as Record<string, string>)[step] ?? "")
        : "";
  if (base === "") return "transparent";

  return ApplyAlpha(base, alpha);
}
