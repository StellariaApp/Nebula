import { fallbackVar, style } from "@vanilla-extract/css";

import { breakpoints } from "@stellaria/nebula-tokens";

import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./SimpleGrid.vars.css.js";

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
  "@media": {
    [`screen and (min-width: ${String(breakpoints.phone)}px)`]: {
      vars: { [variables.cols]: fallbackVar(variables.colsPhone, variables.colsBase) },
    },
    [`screen and (min-width: ${String(breakpoints.tablet)}px)`]: {
      vars: {
        [variables.cols]: fallbackVar(
          variables.colsTablet,
          variables.colsPhone,
          variables.colsBase,
        ),
      },
    },
    [`screen and (min-width: ${String(breakpoints.laptop)}px)`]: {
      vars: {
        [variables.cols]: fallbackVar(
          variables.colsLaptop,
          variables.colsTablet,
          variables.colsPhone,
          variables.colsBase,
        ),
      },
    },
    [`screen and (min-width: ${String(breakpoints.desktop)}px)`]: {
      vars: {
        [variables.cols]: fallbackVar(
          variables.colsDesktop,
          variables.colsLaptop,
          variables.colsTablet,
          variables.colsPhone,
          variables.colsBase,
        ),
      },
    },
    [`screen and (min-width: ${String(breakpoints.wide)}px)`]: {
      vars: {
        [variables.cols]: fallbackVar(
          variables.colsWide,
          variables.colsDesktop,
          variables.colsLaptop,
          variables.colsTablet,
          variables.colsPhone,
          variables.colsBase,
        ),
      },
    },
  },
});
