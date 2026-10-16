import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";

import { interaction, overlay, still } from "../../styles/motion.css.js";
import { composite_layer } from "../../theme/layers.css.js";

const REDUCED = "(prefers-reduced-motion: reduce)";

export const shell = style({
  "@layer": {
    [composite_layer]: {
      background: vars.color.surface.sunken,
      borderRadius: vars.radius.lg,
      height: "100%",
      overflow: "hidden",
      position: "relative",
      width: "100%",
      selectors: {
        "&:fullscreen": { borderRadius: 0 },
      },
    },
  },
});

export const video = style({
  "@layer": {
    [composite_layer]: {
      display: "block",
      height: "100%",
      objectFit: "contain",
      opacity: 0,
      ...overlay,
      width: "100%",
      selectors: {
        '&[data-fit="cover"]': { objectFit: "cover" },
        '&[data-ready="true"]': { opacity: 1 },
      },
      "@media": { [REDUCED]: still },
    },
  },
});

export const placeholder = style({
  "@layer": {
    [composite_layer]: {
      inset: 0,
      position: "absolute",
    },
  },
});

export const badge = style({
  "@layer": {
    [composite_layer]: {
      left: vars.space.sm,
      pointerEvents: "none",
      position: "absolute",
      top: vars.space.sm,
      zIndex: 2,
    },
  },
});

export const grow = style({
  "@layer": {
    [composite_layer]: {
      opacity: 0,
      position: "absolute",
      right: vars.space.sm,
      top: vars.space.sm,
      ...interaction,
      zIndex: 3,
      selectors: {
        [`${shell}:hover &`]: { opacity: 1 },
        [`${shell}:focus-within &`]: { opacity: 1 },
      },
      "@media": {
        [REDUCED]: still,
        "(hover: none)": { opacity: 1 },
      },
    },
  },
});
