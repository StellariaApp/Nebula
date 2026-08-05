import { style, styleVariants } from "@vanilla-extract/css";

import { reduced_media, still, value as valueMotion } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import { barColor, barHeight, progress } from "./ScrollProgress.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
      width: "100%",
      height: barHeight,
      overflow: "hidden",
      selectors: {
        "&[data-position='top']": {
          position: "fixed",
          insetBlockStart: 0,
          insetInline: 0,
          zIndex: vars.zIndex.sticky,
        },
        "&[data-position='bottom']": {
          position: "fixed",
          insetBlockEnd: 0,
          insetInline: 0,
          zIndex: vars.zIndex.sticky,
        },
        "&[data-track='true']": { background: vars.color.surface.sunken },
      },
    },
  },
});

export const bar = style({
  "@layer": {
    [base_layer]: {
      height: "100%",
      width: progress,
      background: barColor,
      ...valueMotion,
      "@media": { [reduced_media]: still },
    },
  },
});

export const radius = styleVariants({
  none: {},
  sm: { borderRadius: vars.radius.sm },
  full: { borderRadius: vars.radius.full },
});
