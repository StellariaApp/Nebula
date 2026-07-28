"use client";

import { type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import {
  AnimatePresence,
  m,
  useReducedMotion,
  type MotionStyle,
  type TargetAndTransition,
} from "motion/react";

import { ExitTween, Spring, Tween } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

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
  const {
    mounted,
    transition = "fade",
    spring: spring_name,
    duration,
    onExitComplete,
    className,
    style,
    children,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const merged_style =
    sprinkle_style === undefined && style === undefined
      ? undefined
      : { ...sprinkle_style, ...style };

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();

  const phase = PRESETS[transition];
  const motion_context = { theme, reduced: prefers_reduced === true };

  const enter =
    spring_name === undefined
      ? Tween(duration ?? "base", "decelerate", motion_context)
      : Spring(spring_name, motion_context);
  const exit = ExitTween(duration ?? "base", motion_context);

  return (
    <AnimatePresence initial={false} {...(onExitComplete === undefined ? {} : { onExitComplete })}>
      {mounted ? (
        <m.div
          className={cx(sprinkle_class, className)}
          {...(merged_style === undefined ? {} : { style: merged_style as MotionStyle })}
          initial={phase.from}
          animate={phase.to}
          exit={{ ...phase.from, transition: exit }}
          transition={enter}
        >
          {children}
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

Transition.displayName = "Transition";
