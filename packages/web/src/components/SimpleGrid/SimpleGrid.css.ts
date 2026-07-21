import { fallbackVar, style } from "@vanilla-extract/css";

import { breakpoints } from "@stellaria/nebula-tokens";

import {
  sgCols,
  sgColsBase,
  sgColsDesktop,
  sgColsLaptop,
  sgColsPhone,
  sgColsTablet,
  sgColsWide,
  sgSpacingX,
  sgSpacingY,
} from "./SimpleGrid.vars.css.js";

export const simpleGrid = style({
  display: "grid",
  boxSizing: "border-box",
  gridTemplateColumns: `repeat(${sgCols}, minmax(0, 1fr))`,
  gap: `${sgSpacingY} ${sgSpacingX}`,
  vars: {
    [sgCols]: sgColsBase,
  },
  "@media": {
    [`screen and (min-width: ${String(breakpoints.phone)}px)`]: {
      vars: { [sgCols]: fallbackVar(sgColsPhone, sgColsBase) },
    },
    [`screen and (min-width: ${String(breakpoints.tablet)}px)`]: {
      vars: { [sgCols]: fallbackVar(sgColsTablet, sgColsPhone, sgColsBase) },
    },
    [`screen and (min-width: ${String(breakpoints.laptop)}px)`]: {
      vars: { [sgCols]: fallbackVar(sgColsLaptop, sgColsTablet, sgColsPhone, sgColsBase) },
    },
    [`screen and (min-width: ${String(breakpoints.desktop)}px)`]: {
      vars: {
        [sgCols]: fallbackVar(sgColsDesktop, sgColsLaptop, sgColsTablet, sgColsPhone, sgColsBase),
      },
    },
    [`screen and (min-width: ${String(breakpoints.wide)}px)`]: {
      vars: {
        [sgCols]: fallbackVar(
          sgColsWide,
          sgColsDesktop,
          sgColsLaptop,
          sgColsTablet,
          sgColsPhone,
          sgColsBase,
        ),
      },
    },
  },
});
