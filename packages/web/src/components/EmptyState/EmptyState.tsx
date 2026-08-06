"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { m, useReducedMotion, type MotionStyle } from "motion/react";

import { MotionOff, Spring } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

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
        <Box
          component="span"
          aria-hidden="true"
          {...iconProps}
          className={cx(styles.icon, iconProps?.className)}
        >
          {icon}
        </Box>
      )}
      <Text {...titleProps} className={cx(styles.title, titleProps?.className)}>
        {title}
      </Text>
      {description === undefined || description === null ? null : (
        <Text {...descriptionProps} className={cx(styles.description, descriptionProps?.className)}>
          {description}
        </Text>
      )}
      {actions === undefined || actions === null ? null : (
        <Box {...actionsProps} className={cx(styles.actions, actionsProps?.className)}>
          {actions}
        </Box>
      )}
    </m.div>
  );
}

EmptyState.displayName = "EmptyState";
