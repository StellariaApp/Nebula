"use client";

import { type CSSProperties, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { domAnimation, LazyMotion, m, useReducedMotion, type MotionStyle } from "motion/react";

import type { CollapseProps } from "./Collapse.types.js";

const HIDDEN: CSSProperties = { overflow: "hidden" };

export function Collapse(props: CollapseProps): ReactElement {
  const { in: is_open = false, duration, className, style, children } = props;
  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();

  const is_off = prefers_reduced === true || theme.motion.tier === "minimal";
  const seconds = (duration ?? theme.motion.duration.base) / 1000;

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={className}
        style={{ ...HIDDEN, ...style } as MotionStyle}
        initial={false}
        animate={{ height: is_open ? "auto" : 0, opacity: is_open ? 1 : 0 }}
        transition={is_off ? { duration: 0 } : { duration: seconds }}
        aria-hidden={is_open ? undefined : true}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

Collapse.displayName = "Collapse";
