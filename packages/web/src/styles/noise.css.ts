import { fallbackVar, style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";
import { primitive_layer } from "../theme/layers.css.js";

import * as variables from "./noise.vars.css.js";

const GRAIN_SVG =
  "%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)' opacity='0.42'/%3E%3C/svg%3E";

export const grain = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      borderRadius: "inherit",
      backgroundImage: `url("data:image/svg+xml,${GRAIN_SVG}")`,
      backgroundSize: "180px 180px",
      backgroundRepeat: "repeat",
      mixBlendMode: "overlay",
      opacity: fallbackVar(variables.opacity, vars.glass.noiseOpacity),
      "@media": {
        "(forced-colors: active)": { display: "none" },
      },
    },
  },
});
