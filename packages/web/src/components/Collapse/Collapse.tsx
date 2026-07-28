"use client";

import { type CSSProperties, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { m, useReducedMotion, type MotionStyle } from "motion/react";

import { Spring, Tween } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import type { CollapseProps } from "./Collapse.types.js";

const HIDDEN: CSSProperties = { overflow: "hidden" };

export function Collapse(props: CollapseProps): ReactElement {
  const { in: is_open = false, duration, className, style, children, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);
  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();

  const motion_context = { theme, reduced: prefers_reduced === true };
  const transition =
    duration === undefined
      ? Spring("default", motion_context)
      : Tween(duration, "decelerate", motion_context);

  return (
    <m.div
      className={cx(sprinkle_class, className)}
      style={{ ...HIDDEN, ...sprinkle_style, ...style } as MotionStyle}
      initial={false}
      animate={{ height: is_open ? "auto" : 0, opacity: is_open ? 1 : 0 }}
      transition={transition}
      aria-hidden={is_open ? undefined : true}
      {...(is_open ? {} : { inert: true })}
    >
      {children}
    </m.div>
  );
}

Collapse.displayName = "Collapse";
