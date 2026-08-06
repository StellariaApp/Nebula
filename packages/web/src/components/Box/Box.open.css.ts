import { style } from "@vanilla-extract/css";

import { breakpoints } from "@stellaria/nebula-tokens";

import { OpenVarName, STYLE_PROPS, type PropSpec } from "../../utils/style-registry.js";

export const BREAKPOINT_ORDER = ["base", "phone", "tablet", "laptop", "desktop", "wide"] as const;

export type BreakpointName = (typeof BREAKPOINT_ORDER)[number];

type Declaration = Record<string, string>;

function Declare(spec: PropSpec, value: string): Declaration {
  const out: Declaration = {};
  for (const css of spec.css) out[css] = value;
  return out;
}

function Chain(name: string, step: number): string {
  let reference = `var(${OpenVarName(name, "base")})`;
  for (let level = 1; level <= step; level += 1) {
    reference = `var(${OpenVarName(name, BREAKPOINT_ORDER[level] as string)}, ${reference})`;
  }
  return reference;
}

function OpenClass(name: string, spec: PropSpec): string {
  const media: Record<string, Declaration> = {};

  for (let step = 1; step < BREAKPOINT_ORDER.length; step += 1) {
    const level = BREAKPOINT_ORDER[step] as Exclude<BreakpointName, "base">;
    media[`screen and (min-width: ${String(breakpoints[level])}px)`] = Declare(
      spec,
      Chain(name, step),
    );
  }

  return style({ ...Declare(spec, Chain(name, 0)), "@media": media });
}

const class_by_prop: Record<string, string> = {};

for (const [name, spec] of Object.entries(STYLE_PROPS) as [string, PropSpec][]) {
  class_by_prop[name] = OpenClass(name, spec);
}

export const OPEN_CLASS: Readonly<Record<string, string>> = class_by_prop;
