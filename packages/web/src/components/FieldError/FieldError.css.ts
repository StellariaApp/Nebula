import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { bubbleBg, bubbleFg } from "./FieldError.vars.css.js";

export const wrapper = style({
  position: "relative",
  display: "block",
  width: "100%",
});

export const bubble = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      insetInlineStart: 0,
      bottom: "calc(100% + 8px)",
      maxWidth: "100%",
      boxSizing: "border-box",
      paddingInline: vars.space.sm,
      paddingBlock: vars.space.xxs,
      borderRadius: vars.radius.sm,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      fontWeight: vars.font.weight.semibold,
      lineHeight: vars.font.lineHeight.tight,
      color: bubbleFg,
      background: bubbleBg,
      boxShadow: vars.shadow.md,
      zIndex: vars.zIndex.tooltip,
      pointerEvents: "none",
      whiteSpace: "normal",
      opacity: 0,
      transform: "translateY(4px)",
      transitionProperty: "opacity, transform",
      transitionDuration: vars.motion.duration.fast,
      transitionTimingFunction: vars.motion.easing.standard,
      selectors: {
        "&[data-open='true']": { opacity: 1, transform: "translateY(0)" },
        "&[data-position='bottom']": {
          bottom: "auto",
          top: "calc(100% + 8px)",
          transform: "translateY(-4px)",
        },
        "&[data-position='bottom'][data-open='true']": { transform: "translateY(0)" },
        "&::after": {
          content: '""',
          position: "absolute",
          insetInlineStart: vars.space.md,
          top: "100%",
          borderWidth: "5px",
          borderStyle: "solid",
          borderColor: "transparent",
          borderTopColor: bubbleBg,
        },
        "&[data-position='bottom']::after": {
          top: "auto",
          bottom: "100%",
          borderTopColor: "transparent",
          borderBottomColor: bubbleBg,
        },
      },
      "@media": {
        "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" },
      },
    },
  },
});
