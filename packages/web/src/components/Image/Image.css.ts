import { style } from "@vanilla-extract/css";

import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Image.vars.css.js";

export const root = style({
  "@layer": {
    [primitive_layer]: {
      position: "relative",
      display: "block",
      boxSizing: "border-box",
      width: variables.width,
      height: variables.height,
      borderRadius: variables.radius,
      overflow: "hidden",
      background: vars.color.surface.sunken,
    },
  },
});

export const img = style({
  display: "block",
  width: "100%",
  height: "100%",
});

export const state = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: vars.color.text.muted,
      fontFamily: vars.font.family.sans,
      fontSize: vars.font.size.caption,
      textAlign: "center",
      padding: vars.space.sm,
    },
  },
});

export const background = style({
  "@layer": {
    [primitive_layer]: {
      position: "relative",
      display: "block",
      boxSizing: "border-box",
      borderRadius: variables.radius,
      overflow: "hidden",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    },
  },
});

export const overlay = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      background: `color-mix(in srgb, ${vars.color.gray["950"]} ${variables.overlayAlpha}, transparent)`,
      pointerEvents: "none",
    },
  },
});

export const background_content = style({
  position: "relative",
  zIndex: 1,
});
