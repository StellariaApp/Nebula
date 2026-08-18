import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { primitive_layer } from "../../theme/layers.css.js";
import { SmallerThan } from "../../theme/media.js";

import * as variables from "./Burger.vars.css.js";

export const burger = style({
  "@layer": {
    [primitive_layer]: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: variables.barGap,
      margin: 0,
      padding: vars.space.xxs,
      background: "none",
      border: 0,
      borderRadius: vars.radius.sm,
      cursor: "pointer",
      color: variables.bar,
      selectors: {
        "&[data-focus-visible='true']": { ...focus.ring },
        "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 },
        "&[data-hovered='true']:not([data-disabled='true'])": {
          background: vars.color.surface.hover,
        },
      },
    },
  },
});

export const line = style({
  "@layer": {
    [primitive_layer]: {
      display: "block",
      width: variables.barWidth,
      height: 2,
      borderRadius: vars.radius.full,
      background: "currentColor",
      transformOrigin: "center",
      ...motion.interaction,
      "@media": {
        "(prefers-reduced-motion: reduce)": motion.still,
      },
    },
  },
});

export const size = styleVariants({
  xs: { vars: { [variables.barWidth]: "12px", [variables.barGap]: "3px" } },
  sm: { vars: { [variables.barWidth]: "16px", [variables.barGap]: "3px" } },
  md: { vars: { [variables.barWidth]: "20px", [variables.barGap]: "4px" } },
  lg: { vars: { [variables.barWidth]: "26px", [variables.barGap]: "5px" } },
  xl: { vars: { [variables.barWidth]: "32px", [variables.barGap]: "6px" } },
});

const SHOWN = { display: "inline-flex" } as const;
const GONE = { display: "none" } as const;

/** El botón solo existe donde la navegación se pliega: su visibilidad es asunto suyo. */
export const show_below = styleVariants({
  always: {},
  phone: {
    "@layer": { [primitive_layer]: { ...GONE, "@media": { [SmallerThan("phone")]: SHOWN } } },
  },
  tablet: {
    "@layer": { [primitive_layer]: { ...GONE, "@media": { [SmallerThan("tablet")]: SHOWN } } },
  },
  laptop: {
    "@layer": { [primitive_layer]: { ...GONE, "@media": { [SmallerThan("laptop")]: SHOWN } } },
  },
});
