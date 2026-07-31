import { createVar, style, styleVariants } from "@vanilla-extract/css";

import { reducedMedia, still, value as valueMotion } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const barColor = createVar();
export const barHeight = createVar();
export const progress = createVar();

export const root = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
      height: "100%",
      width: progress,
      background: barColor,
      ...valueMotion,
      "@media": { [reducedMedia]: still },
    },
  },
});

export const radius = styleVariants({
  none: {},
  sm: { borderRadius: vars.radius.sm },
  full: { borderRadius: vars.radius.full },
});
