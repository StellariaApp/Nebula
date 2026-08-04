import { breakpoints, type BreakpointName } from "@stellaria/nebula-tokens";

export function LargerThan(name: BreakpointName): string {
  return `screen and (min-width: ${String(breakpoints[name])}px)`;
}

export function SmallerThan(name: BreakpointName): string {
  return `screen and (max-width: ${String(breakpoints[name] - 1)}px)`;
}
