import { fallbackVar, style, type StyleRule } from "@vanilla-extract/css";

import { breakpoints, type BreakpointName } from "@stellaria/nebula-tokens";

import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./SimpleGrid.vars.css.js";

type Chain = readonly [string, string, string, string, string, string];

const STEPS: readonly BreakpointName[] = ["phone", "tablet", "laptop", "desktop", "wide"];

function Cascade(tracks: readonly (readonly [string, Chain])[]): NonNullable<StyleRule["@media"]> {
  const out: Record<string, { vars: Record<string, string> }> = {};
  STEPS.forEach((name, index) => {
    const vars: Record<string, string> = {};
    for (const [target, chain] of tracks) {
      const [first, ...rest] = chain.slice(0, index + 2).reverse();
      vars[target] = fallbackVar(first as string, ...rest);
    }
    out[`screen and (min-width: ${String(breakpoints[name])}px)`] = { vars };
  });
  return out;
}

const COLS: Chain = [
  variables.colsBase,
  variables.colsPhone,
  variables.colsTablet,
  variables.colsLaptop,
  variables.colsDesktop,
  variables.colsWide,
];

const SPAN: Chain = [
  variables.spanBase,
  variables.spanPhone,
  variables.spanTablet,
  variables.spanLaptop,
  variables.spanDesktop,
  variables.spanWide,
];

const ROW_SPAN: Chain = [
  variables.rowSpanBase,
  variables.rowSpanPhone,
  variables.rowSpanTablet,
  variables.rowSpanLaptop,
  variables.rowSpanDesktop,
  variables.rowSpanWide,
];

export const simple_grid = style({
  "@layer": {
    [primitive_layer]: {
      display: "grid",
      boxSizing: "border-box",
      gridTemplateColumns: `repeat(${variables.cols}, minmax(0, 1fr))`,
      gap: `${variables.spacingY} ${variables.spacingX}`,
      justifyItems: fallbackVar(variables.justify, "stretch"),
    },
  },
  vars: {
    [variables.cols]: variables.colsBase,
  },
  "@media": Cascade([[variables.cols, COLS]]),
});

export const cell = style({
  "@layer": {
    [primitive_layer]: {
      boxSizing: "border-box",
      minWidth: 0,
      gridColumn: `span ${variables.span}`,
      gridRow: `span ${variables.rowSpan}`,
    },
  },
  vars: {
    [variables.span]: variables.spanBase,
    [variables.rowSpan]: variables.rowSpanBase,
  },
  "@media": Cascade([
    [variables.span, SPAN],
    [variables.rowSpan, ROW_SPAN],
  ]),
});
