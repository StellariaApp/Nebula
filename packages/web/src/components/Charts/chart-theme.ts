import type { ColorExtended } from "@stellaria/nebula-tokens";

import { vars } from "@stellaria/nebula-themes/web";
import { ResolveAccent } from "../../utils/scale.js";

const FALLBACK: readonly ColorExtended[] = [
  "primary",
  "accent",
  "success",
  "warning",
  "info",
  "error",
];

export function SeriesColor(color: ColorExtended | undefined, index: number): string {
  const resolved = color ?? FALLBACK[index % FALLBACK.length] ?? "primary";
  return ResolveAccent(resolved, "500");
}

export const CHART_TOKENS = {
  grid: vars.color.border.subtle,
  axis: vars.color.text.muted,
  text: vars.color.text.secondary,
  surface: vars.color.surface.overlay,
  border: vars.color.border.default,
  radius: vars.radius.md,
  font: vars.font.family.sans,
  fontSize: vars.font.size.caption,
} as const;
