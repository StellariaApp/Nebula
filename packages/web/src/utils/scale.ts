import type { SemanticScaleName } from "@stellaria/nebula-tokens";

import { vars } from "../theme/contract.css.js";

export const SEMANTIC_SCALES: Record<SemanticScaleName, Record<string, string>> = {
  primary: vars.color.primary,
  accent: vars.color.accent,
  gray: vars.color.gray,
  success: vars.color.semantic.success,
  warning: vars.color.semantic.warning,
  error: vars.color.semantic.error,
  info: vars.color.semantic.info,
};

export function ScaleShade(color: SemanticScaleName, shade: string): string {
  return SEMANTIC_SCALES[color][shade] ?? "";
}
