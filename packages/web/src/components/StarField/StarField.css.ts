import { keyframes, style } from "@vanilla-extract/css";

import { reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

import {
  accentColor,
  auroraAccent,
  auroraPrimary,
  accentGlow,
  gridCell,
  gridColor,
  starColor,
  starGlow,
} from "./StarField.vars.css.js";

const FADE_MASK =
  "radial-gradient(ellipse at 50% 30%, #000 28%, rgba(0, 0, 0, 0.82) 66%, transparent 96%)";

const TWINKLE = keyframes({
  "0%, 100%": { opacity: 0.2, transform: "scale(0.8)" },
  "50%": { opacity: 1, transform: "scale(1)" },
});

export const starField = style({
  "@layer": {
    [baseLayer]: {
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
    [baseLayer]: {
      position: "absolute",
      inset: "-8%",
      willChange: "transform",
    },
  },
});

export const grid = style({
  "@layer": {
    [baseLayer]: {
      backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
      backgroundSize: `${gridCell} ${gridCell}`,
    },
  },
});

export const faded = style({
  "@layer": {
    [baseLayer]: {
      WebkitMaskImage: FADE_MASK,
      maskImage: FADE_MASK,
    },
  },
});

export const star = style({
  "@layer": {
    [baseLayer]: {
      position: "absolute",
      borderRadius: vars.radius.full,
      background: starColor,
      boxShadow: starGlow,
      opacity: 0.6,
      animationName: TWINKLE,
      animationDuration: `calc(${vars.motion.duration.expressive} * 6)`,
      animationTimingFunction: vars.motion.easing.standard,
      animationIterationCount: "infinite",
      selectors: {
        "&[data-accent='true']": { background: accentColor, boxShadow: accentGlow },
        "&[data-twinkle='false']": { ...still, opacity: 0.6, transform: "scale(1)" },
      },
      "@media": {
        [reducedMedia]: { ...still, opacity: 0.6, transform: "scale(1)" },
      },
    },
  },
});

const AURORA_BLUR = "150px";

const AURORAS = [
  { top: "-20%", left: "50%", h: "70vh", w: "90vw", shift: true, peak: 0.24, s: 18 },
  { top: "30%", left: "-15%", h: "60vh", w: "60vw", shift: false, peak: 0.18, s: 22 },
  {
    top: "55%",
    left: "auto",
    right: "-10%",
    h: "55vh",
    w: "55vw",
    shift: false,
    peak: 0.15,
    s: 26,
  },
  { top: "15%", left: "60%", h: "30vh", w: "30vw", shift: false, peak: 0.12, s: 20 },
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
    [baseLayer]: { position: "absolute", inset: 0, overflow: "hidden" },
  },
});

export const auroraBlob = AURORAS.map((a, i) =>
  style({
    "@layer": {
      [baseLayer]: {
        position: "absolute",
        top: a.top,
        ...(a.left === "auto" ? { right: a.right } : { left: a.left }),
        height: a.h,
        width: a.w,
        borderRadius: vars.radius.full,
        backgroundImage: `radial-gradient(ellipse at center, ${auroraPrimary} 0%, ${auroraAccent} ${String(40 + i * 4)}%, transparent 70%)`,
        filter: `blur(${AURORA_BLUR})`,
        opacity: a.peak,
        willChange: "transform, opacity",
        ...(a.shift ? { translate: "-50% 0" } : {}),
        animationName: Drift(a.peak, 8 - i * 1.5, 6 - i),
        animationDuration: `${String(a.s)}s`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        selectors: {
          "&[data-still='true']": { ...still, transform: "none" },
        },
        "@media": {
          [reducedMedia]: { ...still, transform: "none" },
        },
      },
    },
  }),
);
