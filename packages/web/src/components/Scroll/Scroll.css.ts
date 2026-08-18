import { fallbackVar, globalStyle, keyframes, style } from "@vanilla-extract/css";
import { recipe, type RecipeVariants } from "@vanilla-extract/recipes";

import { reduced_media } from "../../styles/motion.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { primitive_layer } from "../../theme/layers.css.js";

import * as variables from "./Scroll.vars.css.js";

const size = fallbackVar(variables.scrollbarSize, "8px");

const INK = `color-mix(in srgb, ${vars.color.border.default} 40%, transparent)`;
const BAND = vars.space.xl;
const RANGE = vars.space.xl;
const SUPPORTS = "(animation-timeline: scroll())";
interface Band {
  image: string;
  position: string;
  size: string;
  name: string;
  timeline: string;
  range: string;
  imageRtl?: string | undefined;
  positionRtl?: string | undefined;
}

function Grow(band: string): string {
  return keyframes({ from: { vars: { [band]: "0px" } }, to: { vars: { [band]: BAND } } });
}

function Shrink(band: string): string {
  return keyframes({ from: { vars: { [band]: BAND } }, to: { vars: { [band]: "0px" } } });
}

function Gradient(direction: string): string {
  return `linear-gradient(to ${direction}, ${INK}, transparent)`;
}

const BLOCK: Band[] = [
  {
    image: Gradient("bottom"),
    position: "top center",
    size: `100% ${variables.blockStart}`,
    name: Grow(variables.blockStart),
    timeline: "scroll(self block)",
    range: `0px ${RANGE}`,
  },
  {
    image: Gradient("top"),
    position: "bottom center",
    size: `100% ${variables.blockEnd}`,
    name: Shrink(variables.blockEnd),
    timeline: "scroll(self block)",
    range: `calc(100% - ${RANGE}) 100%`,
  },
];

const INLINE: Band[] = [
  {
    image: Gradient("right"),
    position: "left center",
    size: `${variables.inlineStart} 100%`,
    name: Grow(variables.inlineStart),
    timeline: "scroll(self inline)",
    range: `0px ${RANGE}`,
    imageRtl: Gradient("left"),
    positionRtl: "right center",
  },
  {
    image: Gradient("left"),
    position: "right center",
    size: `${variables.inlineEnd} 100%`,
    name: Shrink(variables.inlineEnd),
    timeline: "scroll(self inline)",
    range: `calc(100% - ${RANGE}) 100%`,
    imageRtl: Gradient("right"),
    positionRtl: "left center",
  },
];

function Join(bands: Band[], Pick: (band: Band) => string): string {
  return bands.map(Pick).join(", ");
}

function Bands(bands: Band[]): Record<string, string> {
  return {
    backgroundImage: `${Join(bands, (band) => band.image)} !important`,
    backgroundPosition: `${Join(bands, (band) => band.position)} !important`,
    backgroundSize: `${Join(bands, (band) => band.size)} !important`,
    backgroundRepeat: `${Join(bands, () => "no-repeat")} !important`,
    animationName: Join(bands, (band) => band.name),
    animationTimeline: Join(bands, (band) => band.timeline),
    animationRange: Join(bands, (band) => band.range),
    animationDuration: Join(bands, () => "auto"),
    animationTimingFunction: Join(bands, () => "linear"),
    animationFillMode: Join(bands, () => "both"),
  };
}

function BandsRtl(bands: Band[]): Record<string, string> {
  return {
    backgroundImage: `${Join(bands, (band) => band.imageRtl ?? band.image)} !important`,
    backgroundPosition: `${Join(bands, (band) => band.positionRtl ?? band.position)} !important`,
  };
}

export const scroll = recipe({
  base: {
    "@layer": {
      [primitive_layer]: {
        boxSizing: "border-box",
        scrollbarWidth: "thin",
        scrollbarColor: `${vars.color.border.strong} transparent`,
        selectors: {
          "&::-webkit-scrollbar": { width: size, height: size },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            background: vars.color.border.strong,
            borderRadius: vars.radius.full,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: vars.color.border.default,
          },
        },
      },
    },
  },
  variants: {
    axis: {
      x: { "@layer": { [primitive_layer]: { overflowX: "auto", overflowY: "hidden" } } },
      y: { "@layer": { [primitive_layer]: { overflowX: "hidden", overflowY: "auto" } } },
      xy: { "@layer": { [primitive_layer]: { overflow: "auto" } } },
    },
    gutter: {
      true: { "@layer": { [primitive_layer]: { scrollbarGutter: "stable" } } },
      false: {},
    },
    smooth: {
      true: {
        "@layer": {
          [primitive_layer]: {
            scrollBehavior: "smooth",
            "@media": { [reduced_media]: { scrollBehavior: "auto" } },
          },
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    axis: "y",
    gutter: false,
    smooth: false,
  },
});

export type ScrollRecipeVariants = NonNullable<RecipeVariants<typeof scroll>>;

export const block_shadows = style({
  "@layer": { [primitive_layer]: { "@supports": { [SUPPORTS]: Bands(BLOCK) } } },
});

export const inline_shadows = style({
  "@layer": {
    [primitive_layer]: {
      "@supports": {
        [SUPPORTS]: { ...Bands(INLINE), selectors: { "&:dir(rtl)": BandsRtl(INLINE) } },
      },
    },
  },
});

export const both_shadows = style({
  "@layer": {
    [primitive_layer]: {
      "@supports": {
        [SUPPORTS]: {
          ...Bands([...BLOCK, ...INLINE]),
          selectors: { "&:dir(rtl)": BandsRtl([...BLOCK, ...INLINE]) },
        },
      },
    },
  },
});

export const bouncing = style({});

globalStyle(`${bouncing} > *`, {
  "@layer": {
    [primitive_layer]: {
      transform: `translate3d(0, ${fallbackVar(variables.bounceOffset, "0px")}, 0)`,
      willChange: "transform",
      "@media": {
        [reduced_media]: { transform: "none" },
      },
    },
  },
});
