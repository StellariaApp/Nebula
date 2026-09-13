import { globalStyle, style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";

import { composite_layer } from "../theme/layers.css.js";
import * as focus from "./focus.css.js";

export const FILLED = "--nebula-player-filled";

const FILL = vars.color.primary[500];
const REST = `color-mix(in srgb, ${vars.color.text.primary} 18%, transparent)`;
const REST_OVER_MEDIA = `color-mix(in srgb, ${vars.color.text.primary} 38%, transparent)`;
const THUMB = 12;

export const track = style({
  "@layer": {
    [composite_layer]: {
      appearance: "none",
      background: "transparent",
      cursor: "pointer",
      flex: 1,
      height: 18,
      minWidth: 0,
      margin: 0,
      vars: { [FILLED]: "0%" },
      ":focus-visible": focus.ring,
    },
  },
});

globalStyle(`${track}::-webkit-slider-runnable-track`, {
  "@layer": {
    [composite_layer]: {
      background: `linear-gradient(to right, ${FILL} var(${FILLED}), ${REST} var(${FILLED}))`,
      borderRadius: vars.radius.full,
      height: 4,
    },
  },
});

globalStyle(`${track}::-webkit-slider-thumb`, {
  "@layer": {
    [composite_layer]: {
      appearance: "none",
      background: FILL,
      borderRadius: vars.radius.full,
      height: THUMB,
      marginTop: -4,
      width: THUMB,
    },
  },
});

globalStyle(`${track}::-moz-range-track`, {
  "@layer": {
    [composite_layer]: {
      background: `linear-gradient(to right, ${FILL} var(${FILLED}), ${REST} var(${FILLED}))`,
      borderRadius: vars.radius.full,
      height: 4,
    },
  },
});

globalStyle(`${track}::-moz-range-thumb`, {
  "@layer": {
    [composite_layer]: {
      background: FILL,
      border: "none",
      borderRadius: vars.radius.full,
      height: THUMB,
      width: THUMB,
    },
  },
});

export const track_over_media = style({
  "@layer": {
    [composite_layer]: {
      flex: "none",
      height: 14,
      width: "100%",
    },
  },
});

globalStyle(`${track_over_media}::-webkit-slider-runnable-track`, {
  "@layer": {
    [composite_layer]: {
      background: `linear-gradient(to right, ${FILL} var(${FILLED}), ${REST_OVER_MEDIA} var(${FILLED}))`,
      boxShadow: `0 0 0 1px color-mix(in srgb, ${vars.color.surface.base} 35%, transparent)`,
    },
  },
});

globalStyle(`${track_over_media}::-moz-range-track`, {
  "@layer": {
    [composite_layer]: {
      background: `linear-gradient(to right, ${FILL} var(${FILLED}), ${REST_OVER_MEDIA} var(${FILLED}))`,
      boxShadow: `0 0 0 1px color-mix(in srgb, ${vars.color.surface.base} 35%, transparent)`,
    },
  },
});

export const mixer = style({
  "@layer": {
    [composite_layer]: {
      alignItems: "center",
      display: "flex",
      flexDirection: "column",
      gap: vars.space.xs,
    },
  },
});

export const mixer_slider = style({
  "@layer": {
    [composite_layer]: {
      appearance: "none",
      background: "transparent",
      cursor: "pointer",
      direction: "rtl",
      height: 76,
      margin: 0,
      vars: { [FILLED]: "100%" },
      width: 18,
      writingMode: "vertical-rl",
      ":focus-visible": focus.ring,
    },
  },
});

globalStyle(`${mixer_slider}::-webkit-slider-runnable-track`, {
  "@layer": {
    [composite_layer]: {
      background: `linear-gradient(to top, ${FILL} var(${FILLED}), ${REST} var(${FILLED}))`,
      borderRadius: vars.radius.full,
      height: "100%",
      width: 4,
    },
  },
});

globalStyle(`${mixer_slider}::-webkit-slider-thumb`, {
  "@layer": {
    [composite_layer]: {
      appearance: "none",
      background: FILL,
      borderRadius: vars.radius.full,
      height: THUMB,
      marginLeft: -4,
      width: THUMB,
    },
  },
});

globalStyle(`${mixer_slider}::-moz-range-track`, {
  "@layer": {
    [composite_layer]: {
      background: `linear-gradient(to top, ${FILL} var(${FILLED}), ${REST} var(${FILLED}))`,
      borderRadius: vars.radius.full,
      height: "100%",
      width: 4,
    },
  },
});

globalStyle(`${mixer_slider}::-moz-range-thumb`, {
  "@layer": {
    [composite_layer]: {
      background: FILL,
      border: "none",
      borderRadius: vars.radius.full,
      height: THUMB,
      width: THUMB,
    },
  },
});
