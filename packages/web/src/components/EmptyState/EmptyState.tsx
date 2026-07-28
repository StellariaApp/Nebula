"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { domAnimation, LazyMotion, m, useReducedMotion, type MotionStyle } from "motion/react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./EmptyState.css.js";
import type { EmptyStateProps } from "./EmptyState.types.js";

export function EmptyState(props: EmptyStateProps): ReactElement {
  const { title, description, icon, actions, size = "md", className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const is_off = prefers_reduced === true || theme.motion.tier === "minimal";
  const spring = theme.motion.spring.gentle;

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        className={cx(styles.root({ size }), sprinkle_class, className)}
        {...(sprinkle_style === undefined ? {} : { style: sprinkle_style as MotionStyle })}
        initial={is_off ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          is_off
            ? { duration: 0 }
            : {
                type: "spring",
                stiffness: spring.stiffness,
                damping: spring.damping,
                mass: spring.mass,
              }
        }
      >
        {icon === undefined || icon === null ? null : (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <p className={styles.title}>{title}</p>
        {description === undefined || description === null ? null : (
          <p className={styles.description}>{description}</p>
        )}
        {actions === undefined || actions === null ? null : (
          <div className={styles.actions}>{actions}</div>
        )}
      </m.div>
    </LazyMotion>
  );
}

EmptyState.displayName = "EmptyState";
