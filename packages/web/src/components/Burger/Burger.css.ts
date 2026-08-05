import { createVar, style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";
import { SmallerThan } from "../../theme/media.js";

export const bar = createVar();
export const barWidth = createVar();
export const barGap = createVar();

export const burger = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: barGap,
      margin: 0,
      padding: vars.space.xxs,
      background: "none",
      border: 0,
      borderRadius: vars.radius.sm,
      cursor: "pointer",
      color: bar,
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
    [baseLayer]: {
      display: "block",
      width: barWidth,
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
  xs: { vars: { [barWidth]: "12px", [barGap]: "3px" } },
  sm: { vars: { [barWidth]: "16px", [barGap]: "3px" } },
  md: { vars: { [barWidth]: "20px", [barGap]: "4px" } },
  lg: { vars: { [barWidth]: "26px", [barGap]: "5px" } },
  xl: { vars: { [barWidth]: "32px", [barGap]: "6px" } },
});

const SHOWN = { display: "inline-flex" } as const;
const GONE = { display: "none" } as const;

/** El botón solo existe donde la navegación se pliega: su visibilidad es asunto suyo. */
export const showBelow = styleVariants({
  always: {},
  phone: { "@layer": { [baseLayer]: { ...GONE, "@media": { [SmallerThan("phone")]: SHOWN } } } },
  tablet: { "@layer": { [baseLayer]: { ...GONE, "@media": { [SmallerThan("tablet")]: SHOWN } } } },
  laptop: { "@layer": { [baseLayer]: { ...GONE, "@media": { [SmallerThan("laptop")]: SHOWN } } } },
});
