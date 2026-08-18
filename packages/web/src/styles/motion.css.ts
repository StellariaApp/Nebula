import { vars } from "@stellaria/nebula-themes/web";

const REDUCED = "(prefers-reduced-motion: reduce)";

export const interaction = {
  transitionProperty: "background, border-color, color, text-decoration-color, box-shadow, opacity",
  transitionDuration: vars.motion.duration.fast,
  transitionTimingFunction: vars.motion.easing.standard,
} as const;

export const layout = {
  transitionProperty: "transform, opacity",
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.decelerate,
} as const;

export const overlay = {
  transitionProperty: "opacity, transform",
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.standard,
} as const;

export const confirm = {
  transitionProperty: "opacity, transform",
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.emphasized,
} as const;

export const value = {
  transitionProperty: "width, stroke-dashoffset",
  transitionDuration: vars.motion.duration.base,
  transitionTimingFunction: vars.motion.easing.decelerate,
} as const;

export const still = {
  transitionProperty: "none",
  animationName: "none",
} as const;

export const reduced_motion = {
  "@media": { [REDUCED]: still },
} as const;

export const reduced_media = REDUCED;
