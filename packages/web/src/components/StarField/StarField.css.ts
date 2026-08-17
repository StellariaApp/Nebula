import { keyframes, style } from "@vanilla-extract/css";

import { reduced_media, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./StarField.vars.css.js";

const FADE_MASK =
  "radial-gradient(ellipse at 50% 30%, #000 28%, rgba(0, 0, 0, 0.82) 66%, transparent 96%)";

const TWINKLE = keyframes({
  "0%, 100%": { opacity: 0.2, transform: "scale(0.8)" },
  "50%": { opacity: 1, transform: "scale(1)" },
});

export const star_field = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      pointerEvents: "none",
      selectors: {
        "&[data-fixed='true']": { position: "fixed" },
      },
      "@media": {
        "(forced-colors: active)": { display: "none" },
      },
    },
  },
});

export const layer = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      inset: "-8%",
      willChange: "transform",
    },
  },
});

export const grid = style({
  "@layer": {
    [primitive_layer]: {
      backgroundImage: `linear-gradient(${variables.gridColor} 1px, transparent 1px), linear-gradient(90deg, ${variables.gridColor} 1px, transparent 1px)`,
      backgroundSize: `${variables.gridCell} ${variables.gridCell}`,
    },
  },
});

export const faded = style({
  "@layer": {
    [primitive_layer]: {
      WebkitMaskImage: FADE_MASK,
      maskImage: FADE_MASK,
    },
  },
});

export const star = style({
  "@layer": {
    [primitive_layer]: {
      position: "absolute",
      borderRadius: vars.radius.full,
      background: variables.starColor,
      boxShadow: variables.starGlow,
      opacity: 0.6,
      animationName: TWINKLE,
      animationDuration: `calc(${vars.motion.duration.expressive} * 6)`,
      animationTimingFunction: vars.motion.easing.standard,
      animationIterationCount: "infinite",
      selectors: {
        "&[data-accent='true']": {
          background: variables.accentColor,
          boxShadow: variables.accentGlow,
        },
        "&[data-twinkle='false']": { ...still, opacity: 0.6, transform: "scale(1)" },
      },
      "@media": {
        [reduced_media]: { ...still, opacity: 0.6, transform: "scale(1)" },
      },
    },
  },
});

const AURORA_BLUR = vars.blur.xxl;

const AURORAS = [
  { top: "-20%", left: "50%", h: "70vh", w: "90vw", shift: true, peak: 0.3, cycle: 43 },
  { top: "30%", left: "-15%", h: "60vh", w: "60vw", shift: false, peak: 0.24, cycle: 52 },
  {
    top: "55%",
    left: "auto",
    right: "-10%",
    h: "55vh",
    w: "55vw",
    shift: false,
    peak: 0.15,
    cycle: 62,
  },
  { top: "15%", left: "60%", h: "30vh", w: "30vw", shift: false, peak: 0.24, cycle: 48 },
] as const;

function Drift(peak: number, dx: number, dy: number): string {
  return keyframes({
    "0%, 100%": { transform: "translate(0%, 0%) scale(1)", opacity: peak },
    "33%": {
      transform: `translate(${String(dx)}%, ${String(-dy)}%) scale(1.08)`,
      opacity: peak * 1.22,
    },
    "66%": {
      transform: `translate(${String(-dx * 0.6)}%, ${String(dy * 0.7)}%) scale(0.93)`,
      opacity: peak * 0.85,
    },
  });
}

export const aurora = style({
  "@layer": {
    [primitive_layer]: { position: "absolute", inset: 0, overflow: "hidden" },
  },
});

export const aurora_blob = AURORAS.map((a, i) =>
  style({
    "@layer": {
      [primitive_layer]: {
        position: "absolute",
        top: a.top,
        ...(a.left === "auto" ? { right: a.right } : { left: a.left }),
        height: a.h,
        width: a.w,
        borderRadius: vars.radius.full,
        backgroundImage: `radial-gradient(ellipse at center, ${variables.auroraPrimary} 0%, ${variables.auroraAccent} ${String(40 + i * 4)}%, transparent 70%)`,
        filter: `blur(${AURORA_BLUR})`,
        opacity: a.peak,
        willChange: "transform, opacity",
        ...(a.shift ? { translate: "-50% 0" } : {}),
        animationName: Drift(a.peak, 8 - i * 1.5, 6 - i),
        animationDuration: `calc(${vars.motion.duration.expressive} * ${String(a.cycle)})`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        selectors: {
          "&[data-still='true']": { ...still, transform: "none" },
        },
        "@media": {
          [reduced_media]: { ...still, transform: "none" },
        },
      },
    },
  }),
);
