import { createVar, style, styleVariants } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { interaction, reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const frameRatio = createVar();

export const trigger = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "block",
      width: "100%",
      padding: 0,
      border: `1px solid ${vars.color.border.subtle}`,
      background: vars.color.surface.sunken,
      aspectRatio: frameRatio,
      overflow: "hidden",
      cursor: "pointer",
      ...interaction,
      selectors: {
        "&:hover:not(:disabled)": { borderColor: vars.color.border.strong },
        "&:disabled": { cursor: "not-allowed", opacity: 0.55 },
        "&:focus-visible": { ...focus.ring },
      },
      "@media": { [reducedMedia]: still },
    },
  },
});

export const image = style({
  "@layer": {
    [baseLayer]: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  },
});

export const hint = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
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
