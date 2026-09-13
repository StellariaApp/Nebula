import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";

import * as focus from "../../styles/focus.css.js";
import { still } from "../../styles/motion.css.js";
import { composite_layer } from "../../theme/layers.css.js";

const REDUCED = "(prefers-reduced-motion: reduce)";
const FINE_POINTER = "(hover: hover) and (pointer: fine)";
const Faded = (color: string, percent: number): string =>
  `color-mix(in srgb, ${color} ${String(percent)}%, transparent)`;

export const overlay = style({
  "@layer": {
    [composite_layer]: {
      position: "fixed",
      inset: 0,
      zIndex: vars.zIndex.modal,
      display: "flex",
      flexDirection: "column",
      background: Faded(vars.color.surface.base, 96),
      backdropFilter: vars.glass.strong.backdropFilter,
      color: vars.color.text.primary,
      fontFamily: vars.font.family.sans,
    },
  },
});

export const bar = style({
  "@layer": {
    [composite_layer]: {
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.sm,
      paddingBlock: vars.space.sm,
      paddingInline: vars.space.md,
    },
  },
});

export const heading = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
      minWidth: 0,
      overflow: "hidden",
      borderRadius: vars.radius.md,
      border: `1px solid ${Faded(vars.color.text.primary, 12)}`,
      background: Faded(vars.color.surface.base, 70),
      paddingBlock: vars.space.xs,
      paddingInline: vars.space.sm,
    },
  },
});

export const actions = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.sm,
    },
  },
});

export const download = style({
  "@layer": {
    [composite_layer]: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: vars.size.control.md,
      height: vars.size.control.md,
      borderRadius: vars.radius.md,
      border: `1px solid ${Faded(vars.color.text.primary, 14)}`,
      background: Faded(vars.color.text.primary, 6),
      color: vars.color.text.primary,
      textDecoration: "none",
      transitionProperty: "background, border-color",
      transitionDuration: vars.motion.duration.fast,
      transitionTimingFunction: vars.motion.easing.standard,
      ":hover": { background: Faded(vars.color.text.primary, 12) },
      ":focus-visible": focus.ring,
      "@media": { [REDUCED]: still },
    },
  },
});

export const stage = style({
  "@layer": {
    [composite_layer]: {
      position: "relative",
      flex: 1,
      minHeight: 0,
      overflow: "hidden",
      touchAction: "none",
      ":focus-visible": focus.ring,
    },
  },
});

export const track = style({
  "@layer": {
    [composite_layer]: {
      display: "flex",
      height: "100%",
      width: "100%",
      willChange: "transform",
      selectors: {
        '&[data-dragging="false"]': {
          transitionProperty: "transform",
          transitionDuration: vars.motion.duration.base,
          transitionTimingFunction: vars.motion.easing.decelerate,
        },
      },
      "@media": { [REDUCED]: still },
    },
  },
});

globalStyle(`${stage}[data-zoomed="true"] ${track}`, {
  "@layer": { [composite_layer]: { opacity: 0 } },
});

export const slide = style({
  "@layer": {
    [composite_layer]: {
      flex: "0 0 100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      minWidth: 0,
    },
  },
});

export const piece = style({
  "@layer": {
    [composite_layer]: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
      userSelect: "none",
      WebkitUserSelect: "none",
      WebkitTouchCallout: "none",
    },
  },
});

export const zoom = style({
  "@layer": {
    [composite_layer]: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      pointerEvents: "none",
    },
  },
});

export const strip = style({
  "@layer": {
    [composite_layer]: {
      flex: "none",
      display: "flex",
      gap: vars.space.xs,
      margin: 0,
      padding: `${vars.space.sm} calc(50% - 32px)`,
      listStyle: "none",
      overflowX: "auto",
      scrollSnapType: "x mandatory",
      scrollbarWidth: "none",
      scrollBehavior: "smooth",
      "@media": { [REDUCED]: { scrollBehavior: "auto" } },
    },
  },
});

export const thumb = style({
  "@layer": {
    [composite_layer]: {
      flex: "none",
      position: "relative",
      width: 64,
      aspectRatio: "3 / 4",
      padding: 0,
      border: 0,
      overflow: "hidden",
      borderRadius: vars.radius.md,
      background: "transparent",
      opacity: 0.4,
      cursor: "pointer",
      scrollSnapAlign: "center",
      transitionProperty: "opacity, transform",
      transitionDuration: vars.motion.duration.fast,
      transitionTimingFunction: vars.motion.easing.standard,
      selectors: {
        "&[aria-current='true']": {
          opacity: 1,
          transform: "scale(1.08)",
          outline: `2px solid ${vars.color.primary[500]}`,
          outlineOffset: -2,
        },
        "&:focus-visible": focus.ring,
      },
      "@media": { [REDUCED]: still },
    },
  },
});

export const thumb_image = style({
  "@layer": {
    [composite_layer]: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  },
});

const arrow = {
  display: "none",
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  alignItems: "center",
  justifyContent: "center",
  width: vars.size.control.md,
  height: vars.size.control.md,
  padding: 0,
  borderRadius: vars.radius.full,
  border: `1px solid ${Faded(vars.color.text.primary, 14)}`,
  background: vars.glass.strong.background,
  backdropFilter: vars.glass.strong.backdropFilter,
  color: vars.color.text.primary,
  cursor: "pointer",
  zIndex: 2,
  opacity: 0.7,
  transitionProperty: "background, opacity",
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,
  ":hover": { opacity: 1 },
  ":focus-visible": focus.ring,
  "@media": {
    [FINE_POINTER]: { display: "flex" },
    [REDUCED]: still,
  },
} as const;

export const arrow_start = style({
  "@layer": { [composite_layer]: { ...arrow, left: vars.space.md } },
});

export const arrow_end = style({
  "@layer": { [composite_layer]: { ...arrow, right: vars.space.md } },
});
