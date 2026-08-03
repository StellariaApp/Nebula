"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { useReducedMotion, type TargetAndTransition, type Transition } from "motion/react";

import { ExitTween, MotionOff, Spring, StaggerDelay, Tween } from "../../utils/motion.js";

import type { RevealPreset } from "./Reveal.types.js";

interface Phase {
  from: TargetAndTransition;
  to: TargetAndTransition;
}

export const REVEAL_PRESETS: Record<RevealPreset, Phase> = {
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  scale: { from: { opacity: 0, scale: 0.96 }, to: { opacity: 1, scale: 1 } },
  pop: { from: { opacity: 0, scale: 0.86 }, to: { opacity: 1, scale: 1 } },
  "slide-up": { from: { opacity: 0, y: 24 }, to: { opacity: 1, y: 0 } },
  "slide-down": { from: { opacity: 0, y: -24 }, to: { opacity: 1, y: 0 } },
  "slide-left": { from: { opacity: 0, x: 24 }, to: { opacity: 1, x: 0 } },
  "slide-right": { from: { opacity: 0, x: -24 }, to: { opacity: 1, x: 0 } },
};

export const REVEAL_AMOUNT = 0.2;
export const REVEAL_ROOT_MARGIN = "0px 0px -25% 0px";

export interface UseRevealOptions {
  preset?: RevealPreset | undefined;
  spring?: Parameters<typeof Spring>[0] | undefined;
  duration?: number | undefined;
  once?: boolean | undefined;
  amount?: number | undefined;
  rootMargin?: string | undefined;
  index?: number | undefined;
}

export interface UseRevealResult {
  ref: RefObject<HTMLElement | null>;
  armed: boolean;
  animate: TargetAndTransition | undefined;
  transition: Transition | undefined;
  "data-reveal": "shown" | "hidden" | undefined;
}

export function useReveal(options: UseRevealOptions = {}): UseRevealResult {
  const {
    preset = "slide-up",
    spring: spring_name,
    duration,
    once = true,
    amount = REVEAL_AMOUNT,
    rootMargin = REVEAL_ROOT_MARGIN,
    index,
  } = options;

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const is_off = MotionOff(motion_context);

  const ref = useRef<HTMLElement | null>(null);
  const [armed, set_armed] = useState(false);
  const [shown, set_shown] = useState(false);

  useLayoutEffect(() => {
    if (is_off || typeof IntersectionObserver === "undefined") {
      set_armed(false);
      return;
    }
    set_armed(true);
  }, [is_off]);

  useEffect(() => {
    const element = ref.current;
    if (!armed || element === null) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry === undefined) return;
        if (entry.isIntersecting) set_shown(true);
        else if (!once) set_shown(false);
      },
      { threshold: amount, rootMargin },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [armed, once, amount, rootMargin]);

  if (!armed) {
    return { ref, armed, animate: undefined, transition: undefined, "data-reveal": undefined };
  }

  const phase = REVEAL_PRESETS[preset];
  const enter =
    spring_name === undefined
      ? Tween(duration ?? "slow", "decelerate", motion_context)
      : Spring(spring_name, motion_context);
  const delay = index === undefined ? 0 : StaggerDelay(index, motion_context);

  return {
    ref,
    armed,
    animate: shown ? phase.to : phase.from,
    transition: shown ? { ...enter, delay } : ExitTween(duration ?? "slow", motion_context),
    "data-reveal": shown ? "shown" : "hidden",
  };
}
