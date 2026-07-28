import { globalStyle, style } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import { checkboxColor, checkboxSize } from "./Checkbox.vars.css.js";

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
      selectors: {
        "&[data-disabled='true']": { cursor: "not-allowed", opacity: 0.55 },
      },
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

export const box = style({
  "@layer": {
    [baseLayer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSizing: "border-box",
      width: checkboxSize,
      height: checkboxSize,
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: vars.color.border.strong,
      borderRadius: vars.radius.sm,
      background: vars.color.surface.raised,
      color: vars.color.text.onPrimary,
      ...motion.interaction,
      ...motion.reducedMotion,
    },
  },
});

export const mark = style({
  width: "68%",
  height: "68%",
  opacity: 0,
  ...motion.confirm,
  ...motion.reducedMotion,
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

globalStyle(`${input}:checked + ${box}, ${input}:indeterminate + ${box}`, {
  background: checkboxColor,
  borderColor: checkboxColor,
});

globalStyle(`${input}:checked + ${box} > ${mark}, ${input}:indeterminate + ${box} > ${mark}`, {
  opacity: 1,
});

globalStyle(`${input}:focus-visible + ${box}`, {
  outline: `2px solid ${vars.color.border.focus}`,
  outlineOffset: "2px",
});
