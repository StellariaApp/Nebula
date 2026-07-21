import type { SpacingValue } from "@stellaria/nebula-tokens";

import { vars } from "../theme/contract.css.js";

const SPACE = vars.space as Record<string, string>;

export function LengthToCss(value: number | string): string {
  return typeof value === "number" ? `${String(value)}px` : value;
}

export function SpaceToCss(value: SpacingValue): string {
  if (typeof value === "string" && value in SPACE) return SPACE[value] as string;
  return LengthToCss(value);
}
