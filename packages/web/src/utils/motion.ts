import type {
  DurationName,
  EasingName,
  NebulaTheme,
  SpringConfig,
  SpringName,
} from "@stellaria/nebula-tokens";
import type { Transition, ValueTransition } from "motion/react";

const EXIT_RATIO = 2 / 3;
const STAGGER_CAP = 8;
const SCROLL_STIFFNESS = 0.25;
const SCROLL_DAMPING = 0.5;
const FADE_DURATION: DurationName = "slow";
const FADE_EASING: EasingName = "decelerate";
const BEZIER = /^cubic-bezier\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)$/;

export type MotionSurface = "tooltip" | "popover" | "menu" | "modal" | "drawer" | "toast";

export type MotionPhase = "enter" | "exit";

export interface MotionContext {
  theme: NebulaTheme;
  reduced: boolean;
}

const OFF: Transition = { duration: 0 };

const SURFACE_ENTER: Record<MotionSurface, SpringName | DurationName> = {
  tooltip: "fast",
  popover: "snappy",
  menu: "snappy",
  modal: "default",
  drawer: "default",
  toast: "gentle",
};

function IsSpringName(value: SpringName | DurationName): value is SpringName {
  return value === "gentle" || value === "default" || value === "snappy";
}

export function MotionOff(context: MotionContext): boolean {
  return context.reduced || context.theme.motion.tier === "minimal";
}

export function ToBezier(easing: string): [number, number, number, number] | undefined {
  const parts = BEZIER.exec(easing);
  if (parts === null) return undefined;
  const numbers = parts.slice(1).map(Number);
  if (numbers.some(Number.isNaN)) return undefined;
  return [numbers[0] as number, numbers[1] as number, numbers[2] as number, numbers[3] as number];
}

function TweenValue(
  duration: DurationName | number,
  easing: EasingName,
  context: MotionContext,
): ValueTransition {
  const ms = typeof duration === "number" ? duration : context.theme.motion.duration[duration];
  const ease = ToBezier(context.theme.motion.easing[easing]);
  return {
    type: "tween",
    duration: ms / 1000,
    ...(ease === undefined ? {} : { ease }),
  };
}

export function Fade(context: MotionContext): ValueTransition {
  return { inherit: true, ...TweenValue(FADE_DURATION, FADE_EASING, context) };
}

export function Spring(name: SpringName, context: MotionContext): Transition {
  if (MotionOff(context)) return OFF;
  const config = context.theme.motion.spring[name];
  return {
    type: "spring",
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
    opacity: Fade(context),
  };
}

export function SpringOptions(name: SpringName, theme: NebulaTheme): SpringConfig {
  const config = theme.motion.spring[name];
  return { stiffness: config.stiffness, damping: config.damping, mass: config.mass };
}

export function ScrollSpring(name: SpringName, theme: NebulaTheme): SpringConfig {
  const config = theme.motion.spring[name];
  return {
    stiffness: config.stiffness * SCROLL_STIFFNESS,
    damping: config.damping * SCROLL_DAMPING,
    mass: config.mass,
  };
}

export function Tween(
  duration: DurationName | number,
  easing: EasingName,
  context: MotionContext,
): Transition {
  if (MotionOff(context)) return OFF;
  return TweenValue(duration, easing, context);
}

export function ExitTween(reference: DurationName | number, context: MotionContext): Transition {
  const ms = typeof reference === "number" ? reference : context.theme.motion.duration[reference];
  return Tween(ms * EXIT_RATIO, "accelerate", context);
}

export function SurfaceTransition(
  surface: MotionSurface,
  phase: MotionPhase,
  context: MotionContext,
): Transition {
  if (MotionOff(context)) return OFF;

  const enter = SURFACE_ENTER[surface];

  if (phase === "enter") {
    return IsSpringName(enter) ? Spring(enter, context) : Tween(enter, "decelerate", context);
  }

  return ExitTween(IsSpringName(enter) ? "base" : enter, context);
}

export function Stagger(context: MotionContext): number {
  if (MotionOff(context)) return 0;
  return context.theme.motion.duration.instant / 1000;
}

export function StaggerDelay(index: number, context: MotionContext): number {
  return Math.min(Math.max(index, 0), STAGGER_CAP) * Stagger(context);
}
