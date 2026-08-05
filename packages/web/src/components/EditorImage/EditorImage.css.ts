import { style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { base_layer } from "../../theme/layers.css.js";

import * as variables from "./EditorImage.vars.css.js";

export const trigger = style({
  "@layer": {
    [base_layer]: {
      position: "relative",
      display: "block",
      width: "100%",
      padding: 0,
      border: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.sunken,
      aspectRatio: variables.frameRatio,
      overflow: "hidden",
      cursor: "pointer",
      ...interaction,
      selectors: {
        "&:hover:not(:disabled)": { borderColor: vars.color.border.strong },
        "&:disabled": { cursor: "not-allowed", opacity: 0.55 },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reduced_media]: still },
    },
  },
});

export const image = style({
  "@layer": {
    [base_layer]: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  },
});

export const hint = style({
  "@layer": {
    [base_layer]: {
      position: "absolute",
      insetInline: 0,
      insetBlockEnd: 0,
      padding: vars.space.xs,
      fontSize: vars.font.size.caption,
      color: vars.color.text.inverted,
      background: "rgba(0, 0, 0, 0.55)",
      textAlign: "center",
    },
  },
});

export const missing = style({
  "@layer": {
    [base_layer]: {
      padding: vars.space.md,
      borderRadius: vars.radius.md,
      border: `1px dashed ${vars.color.semantic.warning["600"]}`,
      background: vars.color.surface.sunken,
      color: vars.color.text.secondary,
      fontSize: vars.font.size.body3,
      lineHeight: vars.font.lineHeight.relaxed,
    },
  },
});

export const radius = styleVariants({
  none: { borderRadius: 0 },
  sm: { borderRadius: vars.radius.sm },
  md: { borderRadius: vars.radius.md },
  lg: { borderRadius: vars.radius.lg },
});
