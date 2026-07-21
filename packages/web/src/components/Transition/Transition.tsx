"use client";

import { type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
  type MotionStyle,
  type TargetAndTransition,
} from "motion/react";

import type { TransitionPreset, TransitionProps } from "./Transition.types.js";

interface Phase {
  from: TargetAndTransition;
  to: TargetAndTransition;
}

const PRESETS: Record<TransitionPreset, Phase> = {
  fade: { from: { opacity: 0 }, to: { opacity: 1 } },
  scale: { from: { opacity: 0, scale: 0.95 }, to: { opacity: 1, scale: 1 } },
  pop: { from: { opacity: 0, scale: 0.8 }, to: { opacity: 1, scale: 1 } },
  "slide-up": { from: { opacity: 0, y: 16 }, to: { opacity: 1, y: 0 } },
  "slide-down": { from: { opacity: 0, y: -16 }, to: { opacity: 1, y: 0 } },
  "slide-left": { from: { opacity: 0, x: 16 }, to: { opacity: 1, x: 0 } },
  "slide-right": { from: { opacity: 0, x: -16 }, to: { opacity: 1, x: 0 } },
};

export function Transition(props: TransitionProps): ReactElement {
  const { mounted, transition = "fade", duration, className, style, children } = props;
  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();

  const phase = PRESETS[transition];
  const is_off = prefers_reduced === true || theme.motion.tier === "minimal";
  const seconds = (duration ?? theme.motion.duration.base) / 1000;

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence initial={false}>
        {mounted ? (
          <m.div
            className={className}
            {...(style === undefined ? {} : { style: style as MotionStyle })}
            initial={phase.from}
            animate={phase.to}
            exit={phase.from}
            transition={is_off ? { duration: 0 } : { duration: seconds }}
          >
            {children}
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}

Transition.displayName = "Transition";
