import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { radioColor, radioSize } from "./Radio.vars.css.js";

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

export const dot = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSizing: "border-box",
      width: radioSize,
      height: radioSize,
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: vars.color.border.strong,
      borderRadius: vars.radius.full,
      background: vars.color.surface.raised,
      transitionProperty: "border-color",
      transitionDuration: vars.motion.duration.fast,
      transitionTimingFunction: vars.motion.easing.standard,
    },
  },
});

export const inner = style({
  width: "56%",
  height: "56%",
  borderRadius: vars.radius.full,
  background: radioColor,
  opacity: 0,
  transform: "scale(0.4)",
  transition: `opacity ${vars.motion.duration.fast} ${vars.motion.easing.standard}, transform ${vars.motion.duration.fast} ${vars.motion.easing.standard}`,
});

export const labelText = style({
  "@layer": { [baseLayer]: { lineHeight: vars.font.lineHeight.tight } },
});

export const list = style({ display: "flex", flexDirection: "column", gap: vars.space.xs });
export const listRow = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: vars.space.md,
});

globalStyle(`${input}:checked + ${dot}`, { borderColor: radioColor });
globalStyle(`${input}:checked + ${dot} > ${inner}`, { opacity: 1, transform: "scale(1)" });
globalStyle(`${input}:focus-visible + ${dot}`, {
  outline: `2px solid ${vars.color.border.focus}`,
  outlineOffset: "2px",
});
