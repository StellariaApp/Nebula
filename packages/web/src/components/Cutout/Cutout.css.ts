import { fallbackVar, globalStyle, style } from "@vanilla-extract/css";

import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Cutout.vars.css.js";

export const cutout = style({
  "@layer": {
    [primitive_layer]: {
      position: "relative",
      display: "block",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      isolation: "isolate",
    },
  },
});

export const background = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
    },
  },
});

globalStyle(`${background} > img`, {
  "@layer": {
    [primitive_layer]: {
      display: "block",
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
  },
});

export const figure = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      zIndex: 1,
      width: fallbackVar(variables.figureWidth, "100%"),
      height: "auto",
      objectFit: "cover",
      top: fallbackVar(variables.top, "auto"),
      bottom: fallbackVar(variables.bottom, "0px"),
      left: fallbackVar(variables.left, "auto"),
      right: fallbackVar(variables.right, "0px"),
      transform: `translate(${fallbackVar(variables.translateX, "0px")}, ${fallbackVar(variables.translateY, "0px")}) rotateX(${fallbackVar(variables.rotateX, "0deg")}) rotateY(${fallbackVar(variables.rotateY, "0deg")}) rotateZ(${fallbackVar(variables.rotateZ, "0deg")})`,
      pointerEvents: "none",
    },
  },
});

export const content = style({
  "@layer": {
    [primitive_layer]: {
      position: "relative",
      zIndex: 2,
    },
  },
});
