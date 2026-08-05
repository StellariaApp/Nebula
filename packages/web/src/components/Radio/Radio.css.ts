import { globalStyle, style, styleVariants } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./Radio.vars.css.js";

export const root = style({
  "@layer": {
    [base_layer]: {
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

export const size = styleVariants(
  {
    xs: vars.size.control.xs,
    sm: vars.size.control.sm,
    md: vars.size.control.md,
    lg: vars.size.control.lg,
    xl: vars.size.control.xl,
  },
  (control) => ({ vars: { [variables.size]: `calc(${control} / 2)` } }),
);

export const dot = style({
  "@layer": {
    [base_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      boxSizing: "border-box",
      width: variables.size,
      height: variables.size,
      borderWidth: "2px",
      borderStyle: "solid",
      borderColor: vars.color.border.strong,
      borderRadius: vars.radius.full,
      background: vars.color.surface.raised,
      ...motion.interaction,
      ...motion.reduced_motion,
    },
  },
});

export const inner = style({
  width: "56%",
  height: "56%",
  borderRadius: vars.radius.full,
  background: variables.color,
  opacity: 0,
  transform: "scale(0.4)",
  ...motion.confirm,
  ...motion.reduced_motion,
});

export const label_text = style({
  "@layer": { [base_layer]: { lineHeight: vars.font.lineHeight.tight } },
});

export const list = style({ display: "flex", flexDirection: "column", gap: vars.space.xs });
export const list_row = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: vars.space.md,
});

globalStyle(`${input}:checked + ${dot}`, { borderColor: variables.color });
globalStyle(`${input}:checked + ${dot} > ${inner}`, { opacity: 1, transform: "scale(1)" });
globalStyle(`${input}:focus-visible + ${dot}`, focus.ring);
