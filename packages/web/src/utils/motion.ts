import type { DurationName, EasingName, NebulaTheme, SpringName } from "@stellaria/nebula-tokens";
import type { Transition } from "motion/react";

const EXIT_RATIO = 2 / 3;
const STAGGER_CAP = 8;
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

export function Spring(name: SpringName, context: MotionContext): Transition {
  if (MotionOff(context)) return OFF;
  const config = context.theme.motion.spring[name];
  return {
    type: "spring",
    stiffness: config.stiffness,
    damping: config.damping,
    mass: config.mass,
  };
}

export function Tween(
  duration: DurationName | number,
  easing: EasingName,
  context: MotionContext,
): Transition {
  if (MotionOff(context)) return OFF;
  const ms = typeof duration === "number" ? duration : context.theme.motion.duration[duration];
  const ease = ToBezier(context.theme.motion.easing[easing]);
  return {
    type: "tween",
    duration: ms / 1000,
    ...(ease === undefined ? {} : { ease }),
  };
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

  const reference = IsSpringName(enter) ? "base" : enter;
  return Tween(context.theme.motion.duration[reference] * EXIT_RATIO, "accelerate", context);
}

export function Stagger(context: MotionContext): number {
  if (MotionOff(context)) return 0;
  return context.theme.motion.duration.instant / 1000;
}

export function StaggerDelay(index: number, context: MotionContext): number {
  return Math.min(Math.max(index, 0), STAGGER_CAP) * Stagger(context);
}
