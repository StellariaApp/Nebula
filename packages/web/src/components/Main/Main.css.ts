import { style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { contentGap, contentMax } from "./Main.vars.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      minHeight: 0,
      minWidth: 0,
      flex: 1,
      fontFamily: vars.font.family.sans,
    },
  },
});

export const backdrop = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      inset: 0,
      zIndex: vars.zIndex.base,
      pointerEvents: "none",
      overflow: "hidden",
    },
  },
});

export const content = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      zIndex: 1,
      flex: 1,
      minWidth: 0,
      minHeight: 0,
      selectors: {
        "&[data-padded='true']": { padding: vars.space.lg },
        "&[data-centered='true']": {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        "&[data-railed='true']": {
          boxSizing: "border-box",
          width: "100%",
          maxWidth: contentMax,
          marginInline: "auto",
        },
        "&[data-spacing='true']": {
          display: "flex",
          flexDirection: "column",
          gap: contentGap,
        },
      },
    },
  },
});

export const skip = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      insetBlockStart: vars.space.xs,
      insetInlineStart: vars.space.xs,
      zIndex: vars.zIndex.overlay,
      padding: `${vars.space.xs} ${vars.space.sm}`,
      borderRadius: vars.radius.sm,
      background: vars.color.surface.raised,
      color: vars.color.text.primary,
      fontSize: vars.font.size.body3,
      textDecoration: "none",
      transform: "translateY(-200%)",
      selectors: {
        "&:focus-visible": { transform: "translateY(0)", ...focus.ring },
      },
    },
  },
});
