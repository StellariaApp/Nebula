import { style } from "@vanilla-extract/css";

import { vars } from "@stellaria/nebula-themes/web";

import { overlay, still } from "../../styles/motion.css.js";
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


const AWAKE = ['[data-awake="true"]', ":focus-within", ':has([aria-expanded="true"])'].map(
  (state) => `:not([data-mode="never"])${state}`,
);

export const layer = style({
  "@layer": {
    [composite_layer]: {
      inset: 0,
      pointerEvents: "none",
      position: "absolute",
      zIndex: 3,
    },
  },
});

export const slot = style({
  "@layer": {
    [composite_layer]: {
      alignItems: "center",
      display: "flex",
      gap: vars.space.xs,
      position: "absolute",
      zIndex: 2,
    },
  },
});

const corner_base = {
  alignItems: "center",
  display: "flex",
  gap: vars.space.xs,
  opacity: 0,
  pointerEvents: "auto",
  ...overlay,
} as const;

const SHOW = { opacity: 1 } as const;

function Reveal() {
  const selectors: Record<string, typeof SHOW> = { '&[data-pinned="true"]': SHOW };
  for (const awake of AWAKE) selectors[`${shell}${awake} &`] = SHOW;
  return selectors;
}

export const corner = style({
  "@layer": {
    [composite_layer]: {
      ...corner_base,
      selectors: Reveal(),
      "@media": {
        [REDUCED]: still,
        "(hover: none)": { selectors: { [`${shell}:not([data-mode="never"]) &`]: SHOW } },
      },
    },
  },
});

export const top_start = style({ "@layer": { [composite_layer]: { left: vars.space.sm, top: vars.space.sm } } });
export const top_end = style({ "@layer": { [composite_layer]: { right: vars.space.sm, top: vars.space.sm } } });
export const bottom_start = style({ "@layer": { [composite_layer]: { bottom: vars.space.sm, left: vars.space.sm } } });
export const bottom_end = style({ "@layer": { [composite_layer]: { bottom: vars.space.sm, right: vars.space.sm } } });

const scrim_base = {
  height: "30%",
  left: 0,
  opacity: 0,
  pointerEvents: "none",
  position: "absolute",
  right: 0,
  ...overlay,
} as const;

function ScrimReveal() {
  const selectors: Record<string, typeof SHOW> = {};
  for (const awake of AWAKE) selectors[`${shell}${awake} &`] = SHOW;
  return selectors;
}

export const scrim_top = style({
  "@layer": {
    [composite_layer]: {
      ...scrim_base,
      background: `linear-gradient(to bottom, color-mix(in srgb, ${vars.color.surface.base} 70%, transparent), transparent)`,
      top: 0,
      selectors: ScrimReveal(),
      "@media": {
        [REDUCED]: still,
        "(hover: none)": { selectors: { [`${shell}:not([data-mode="never"]) &`]: SHOW } },
      },
    },
  },
});

export const scrim_bottom = style({
  "@layer": {
    [composite_layer]: {
      ...scrim_base,
      background: `linear-gradient(to top, color-mix(in srgb, ${vars.color.surface.base} 70%, transparent), transparent)`,
      bottom: 0,
      selectors: ScrimReveal(),
      "@media": {
        [REDUCED]: still,
        "(hover: none)": { selectors: { [`${shell}:not([data-mode="never"]) &`]: SHOW } },
      },
    },
  },
});
