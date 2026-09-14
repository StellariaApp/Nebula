import type { BreakpointName } from "@stellaria/nebula-tokens";

import type { SimpleGridResponsive } from "./SimpleGrid.types.js";

export type ResponsiveSlots = Record<"base" | BreakpointName, string>;

const BREAKPOINTS: readonly BreakpointName[] = ["phone", "tablet", "laptop", "desktop", "wide"];

export function ResponsiveVars(
  value: SimpleGridResponsive,
  slots: ResponsiveSlots,
  fallback: number,
): Record<string, string> {
  if (typeof value === "number") return { [slots.base]: String(value) };

  const out: Record<string, string> = { [slots.base]: String(value.base ?? fallback) };
  for (const name of BREAKPOINTS) {
    const step = value[name];
    if (step !== undefined) out[slots[name]] = String(step);
  }
  return out;
}
