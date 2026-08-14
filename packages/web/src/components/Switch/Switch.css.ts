import { globalStyle, style } from "@vanilla-extract/css";

import * as motion from "../../styles/motion.css.js";
import * as focus from "../../styles/focus.css.js";
import { vars } from "../../theme/contract.css.js";
import { component_layer } from "../../theme/layers.css.js";

import * as variables from "./Switch.vars.css.js";

export const root = style({
  "@layer": {
    [component_layer]: {
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
    [component_layer]: {
      position: "relative",
      flexShrink: 0,
      boxSizing: "border-box",
      width: variables.width,
      height: variables.height,
      borderRadius: vars.radius.full,
      background: vars.color.border.strong,
      ...motion.interaction,
    },
  },
});

export const thumb = style({
  position: "absolute",
  top: "2px",
  insetInlineStart: "2px",
  width: `calc(${variables.height} - 4px)`,
  height: `calc(${variables.height} - 4px)`,
  borderRadius: vars.radius.full,
  background: vars.color.surface.base,
  boxShadow: vars.shadow.xs,
  touchAction: "none",
});

export const label_text = style({
  userSelect: "none",
  "@layer": { [component_layer]: { lineHeight: vars.font.lineHeight.tight } },
});

export const list = style({ display: "flex", flexDirection: "column", gap: vars.space.xs });
export const list_row = style({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  gap: vars.space.md,
});

globalStyle(`${input}:checked + ${track}`, { background: variables.color });
globalStyle(`${input}:focus-visible + ${track}`, focus.ring);

globalStyle(`${track}`, {
  ...motion.reduced_motion,
});
