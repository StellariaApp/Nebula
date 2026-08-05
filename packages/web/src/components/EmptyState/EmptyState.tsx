"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { m, useReducedMotion, type MotionStyle } from "motion/react";

import { MotionOff, Spring } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./EmptyState.css.js";
import type { EmptyStateProps } from "./EmptyState.types.js";

export function EmptyState(props: EmptyStateProps): ReactElement {
  const {
    title,
    description,
    icon,
    actions,
    size = "md",
    className,
    titleProps,
    descriptionProps,
    iconProps,
    actionsProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const is_off = MotionOff(motion_context);

  return (
    <m.div
      className={cx(styles.root({ size }), sprinkle_class, className)}
      {...(sprinkle_style === undefined ? {} : { style: sprinkle_style as MotionStyle })}
      initial={is_off ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={Spring("gentle", motion_context)}
    >
      {icon === undefined || icon === null ? null : (
        <span aria-hidden="true" {...iconProps} className={cx(styles.icon, iconProps?.className)}>
          {icon}
        </span>
      )}
      <p {...titleProps} className={cx(styles.title, titleProps?.className)}>
        {title}
      </p>
      {description === undefined || description === null ? null : (
        <p {...descriptionProps} className={cx(styles.description, descriptionProps?.className)}>
          {description}
        </p>
      )}
      {actions === undefined || actions === null ? null : (
        <div {...actionsProps} className={cx(styles.actions, actionsProps?.className)}>
          {actions}
        </div>
      )}
    </m.div>
  );
}

EmptyState.displayName = "EmptyState";
