import { createVar, style } from "@vanilla-extract/css";

import * as focus from "../../styles/focus.css.js";
import { layout, reducedMedia, still } from "../../styles/motion.css.js";
import { vars } from "../../theme/contract.css.js";
import { baseLayer } from "../../theme/layers.css.js";

export const imageTransform = createVar();

export const stage = style({
  "@layer": {
    [baseLayer]: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      minHeight: 240,
      height: "60vh",
      borderRadius: vars.radius.md,
      background: vars.color.surface.sunken,
      touchAction: "none",
      selectors: {
        "&[data-zoomed='true']": { cursor: "grab" },
        "&[data-panning='true']": { cursor: "grabbing" },
        "&:focus-visible": { ...focus.ring },
      },
    },
  },
});

export const image = style({
  "@layer": {
    [baseLayer]: {
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
      transform: imageTransform,
      transformOrigin: "center center",
      userSelect: "none",
      WebkitUserSelect: "none",
      pointerEvents: "none",
      ...layout,
      selectors: {
        "&[data-panning='true']": { transitionProperty: "none" },
      },
      "@media": { [reducedMedia]: still },
    },
  },
});

export const bar = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: vars.space.sm,
      marginTop: vars.space.sm,
    },
  },
});

export const group = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      alignItems: "center",
      gap: vars.space.xxs,
    },
  },
});

export const counter = style({
  "@layer": {
    [baseLayer]: {
      fontSize: vars.font.size.caption,
      fontVariantNumeric: "tabular-nums",
      color: vars.color.text.muted,
    },
  },
});

export const caption = style({
  "@layer": {
    [baseLayer]: {
      margin: 0,
      marginTop: vars.space.xs,
      fontSize: vars.font.size.body3,
      color: vars.color.text.secondary,
      textAlign: "center",
    },
  },
});

export const filmstrip = style({
  "@layer": {
    [baseLayer]: {
      display: "flex",
      gap: vars.space.xxs,
      margin: 0,
      marginTop: vars.space.sm,
      padding: 0,
      listStyle: "none",
      overflowX: "auto",
    },
  },
});

export const thumb = style({
  "@layer": {
    [baseLayer]: {
      display: "block",
      width: 64,
      height: 48,
      padding: 0,
      border: `1px solid ${vars.color.border.subtle}`,
      borderRadius: vars.radius.xs,
      overflow: "hidden",
      background: vars.color.surface.raised,
      cursor: "pointer",
      selectors: {
        "&[aria-current='true']": { borderColor: vars.color.border.focus, borderWidth: 2 },
        "&:focus-visible": { ...focus.ring },
      },
    },
  },
});

export const thumbImage = style({
  "@layer": {
    [baseLayer]: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
  },
});

export const empty = style({
  "@layer": {
    [baseLayer]: {
      padding: vars.space.xl,
      textAlign: "center",
      color: vars.color.text.muted,
    },
  },
});
