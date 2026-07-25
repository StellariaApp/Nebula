import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { switchColor, switchH, switchW } from "./Switch.vars.css.js";

export const root = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      gap: vars.space.sm,
      cursor: "pointer",
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.body1,
      color: vars.color.text.primary,
      selectors: { "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 } },
    },
  },
});

export const input = style({
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: 0,
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  border: 0,
});

export const track = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      flexShrink: 0,
      boxSizing: "border-box",
      width: switchW,
      height: switchH,
      borderRadius: vars.radius.full,
      background: vars.color.border.strong,
      transitionProperty: "background",
      transitionDuration: vars.motion.duration.base,
      transitionTimingFunction: vars.motion.easing.standard,
    },
  },
});

export const thumb = style({
  position: "absolute",
  top: "2px",
  insetInlineStart: "2px",
  width: `calc(${switchH} - 4px)`,
  height: `calc(${switchH} - 4px)`,
  borderRadius: vars.radius.full,
  background: vars.color.surface.base,
  boxShadow: vars.shadow.xs,
  touchAction: "none",
});

export const labelText = style({
  userSelect: "none",
  "@layer": { [baseLayer]: { lineHeight: vars.font.lineHeight.tight } },
});

export const list = style({ display: "flex", flexDirection: "column", gap: vars.space.xs });
export const listRow = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: vars.space.md,
});

globalStyle(`${input}:checked + ${track}`, { background: switchColor });
globalStyle(`${input}:focus-visible + ${track}`, {
  outline: `2px solid ${vars.color.border.focus}`,
  outlineOffset: "2px",
});

globalStyle(`${track}`, {
  "@media": { "(prefers-reduced-motion: reduce)": { transitionDuration: "0.01ms" } },
});
