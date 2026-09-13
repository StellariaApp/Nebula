import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";

import * as focus from "../../styles/focus.css.js";
import { still } from "../../styles/motion.css.js";
import { composite_layer } from "../../theme/layers.css.js";

const REDUCED = "(prefers-reduced-motion: reduce)";
const Faded = (color: string, percent: number): string =>
  `color-mix(in srgb, ${color} ${String(percent)}%, transparent)`;

/** What the foot measures: the 30 px portrait with its padding and one line. Two things sit on it. */
const FOOT = 70;

export const link = style({
  "@layer": {
    [composite_layer]: {
      display: "block",
      height: "100%",
      color: "inherit",
      textDecoration: "none",
      ":focus-visible": focus.ring,
    },
  },
});

export const frame = style({
  "@layer": {
    [composite_layer]: {
      position: "relative",
      width: "100%",
      aspectRatio: "3 / 4",
      overflow: "hidden",
    },
  },
});

export const layer = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      inset: 0,
      opacity: 0,
      transitionProperty: "opacity",
      transitionDuration: vars.motion.duration.slow,
      transitionTimingFunction: vars.motion.easing.standard,
      selectors: { '&[data-active="true"]': { opacity: 1 } },
      "@media": { [REDUCED]: still },
    },
  },
});

export const image = style({
  "@layer": {
    [composite_layer]: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  },
});

export const cell = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      left: "50%",
      top: "50%",
      height: "300%",
      width: "auto",
      maxWidth: "none",
      transform: "translate(-16.667%, -77.5%)",
    },
  },
});

export const clip = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 1,
    },
  },
});

export const scrim = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      insetInline: 0,
      bottom: 0,
      height: "62%",
      background: `linear-gradient(to top, ${Faded(vars.color.surface.base, 98)} 15%, ${Faded(vars.color.surface.base, 80)} 40%, transparent)`,
      pointerEvents: "none",
      zIndex: 2,
    },
  },
});

export const top_scrim = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      insetInline: 0,
      top: 0,
      height: "26%",
      background: `linear-gradient(to bottom, ${Faded(vars.color.surface.base, 72)}, transparent)`,
      pointerEvents: "none",
      zIndex: 2,
    },
  },
});

export const corner_start = style({
  "@layer": {
    [composite_layer]: {
      pointerEvents: "none",
      position: "absolute",
      top: vars.space.sm,
      left: vars.space.sm,
      zIndex: 3,
    },
  },
});

export const corner_end = style({
  "@layer": {
    [composite_layer]: {
      pointerEvents: "none",
      position: "absolute",
      top: vars.space.sm,
      right: vars.space.sm,
      zIndex: 3,
    },
  },
});

export const action = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      right: vars.space.sm,
      top: vars.space.sm,
      zIndex: 4,
    },
  },
});

export const action_start = style({
  "@layer": {
    [composite_layer]: { position: "absolute", left: vars.space.sm, top: vars.space.sm, zIndex: 4 },
  },
});

export const meta = style({
  "@layer": {
    [composite_layer]: {
      pointerEvents: "none",
      position: "absolute",
      insetInline: 0,
      bottom: 0,
      zIndex: 3,
    },
  },
});

export const hit = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      inset: 0,
      padding: 0,
      border: 0,
      background: "none",
      cursor: "zoom-in",
      zIndex: 3,
      ":focus-visible": focus.ring,
    },
  },
});

export const fading = style({
  "@layer": {
    [composite_layer]: {
      transitionProperty: "opacity, transform",
      transitionDuration: vars.motion.duration.base,
      transitionTimingFunction: vars.motion.easing.standard,
      selectors: { '&[data-hidden="true"]': { opacity: 0, pointerEvents: "none" } },
      "@media": { [REDUCED]: { transitionProperty: "opacity" } },
    },
  },
});

export const fading_top = style({
  "@layer": {
    [composite_layer]: {
      selectors: { '&[data-hidden="true"]': { transform: "translateY(-6px)" } },
      "@media": { [REDUCED]: { selectors: { '&[data-hidden="true"]': { transform: "none" } } } },
    },
  },
});

export const fading_foot = style({
  "@layer": {
    [composite_layer]: {
      selectors: { '&[data-hidden="true"]': { transform: "translateY(100%)" } },
      "@media": { [REDUCED]: { selectors: { '&[data-hidden="true"]': { transform: "none" } } } },
    },
  },
});

export const stamps = style({
  "@layer": {
    [composite_layer]: {
      alignItems: "center",
      bottom: FOOT,
      display: "flex",
      gap: vars.space.xs,
      insetInlineStart: vars.space.sm,
      pointerEvents: "none",
      position: "absolute",
      zIndex: 3,
    },
  },
});

export const stage = style({
  "@layer": {
    [composite_layer]: {
      height: "100%",
      insetInline: 0,
      position: "absolute",
      top: 0,
      zIndex: 1,
      transitionProperty: "bottom",
      transitionDuration: vars.motion.duration.base,
      transitionTimingFunction: vars.motion.easing.standard,
      selectors: { '&[data-playing="true"]': { bottom: 0 } },
      "@media": { [REDUCED]: still },
    },
  },
});

export const stats = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      flexDirection: "row",
      gap: vars.space.sm,
      position: "absolute",
      top: -30,
      right: vars.space.sm,
    },
  },
});
