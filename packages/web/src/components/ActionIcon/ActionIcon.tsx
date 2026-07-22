"use client";

import {
  forwardRef,
  useMemo,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import {
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
  type HTMLMotionProps,
  type MotionStyle,
} from "motion/react";
import { mergeProps, useButton, useFocusRing, useHover, useObjectRef } from "react-aria";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx } from "../../utils/style-props.js";

import * as styles from "./ActionIcon.css.js";
import type { ActionIconProps } from "./ActionIcon.types.js";
import {
  backdropFilter,
  bg,
  bgActive,
  bgHover,
  borderColor,
  borderWidth,
  fg,
  glow,
} from "./ActionIcon.vars.css.js";

const PRESS_SCALE = 0.94;

export const ActionIcon = forwardRef<HTMLButtonElement, ActionIconProps>(
  function ActionIcon(props, forwardedRef) {
    const {
      variant = "filled",
      size = "md",
      color = "primary",
      gradient,
      disabled = false,
      loading = false,
      children,
      className,
      style,
      ...rest
    } = props;

    const { theme } = useTheme();
    const local_ref = useRef<HTMLButtonElement>(null);
    const ref = useObjectRef(forwardedRef ?? local_ref);
    const prefers_reduced = useReducedMotion();
    const is_disabled = disabled || loading;

    const { onClick, onPress, type, ...dom_rest } = rest;
    const { buttonProps, isPressed } = useButton(
      {
        isDisabled: is_disabled,
        elementType: "button",
        type: type ?? "button",
        ...(onClick === undefined
          ? {}
          : {
              onClick: (event: ReactMouseEvent<Element>) => {
                onClick(event as ReactMouseEvent<HTMLButtonElement>);
              },
            }),
        ...(onPress === undefined ? {} : { onPress }),
      },
      ref,
    );
    const { hoverProps, isHovered } = useHover({ isDisabled: is_disabled });
    const { focusProps, isFocusVisible } = useFocusRing();

    const resolved = useMemo(
      () => ResolveVariant(variant, color, theme, gradient),
      [variant, color, theme, gradient],
    );

    const css_vars = useMemo<CSSProperties>(
      () =>
        assignInlineVars({
          [bg]: resolved.background,
          [bgHover]: resolved.backgroundHover,
          [bgActive]: resolved.backgroundActive,
          [fg]: resolved.foreground,
          [borderColor]: resolved.borderColor,
          [borderWidth]: resolved.borderWidth,
          [backdropFilter]: resolved.backdropFilter,
          [glow]: resolved.glow,
        }),
      [resolved],
    );

    const spring = theme.motion.spring.default;
    const is_animated = resolved.animated && prefers_reduced !== true && !is_disabled;

    const dom_props = mergeProps(buttonProps, hoverProps, focusProps, dom_rest) as unknown as Omit<
      HTMLMotionProps<"button">,
      "style"
    >;

    return (
      <LazyMotion features={domAnimation} strict>
        <m.button
          {...dom_props}
          ref={ref}
          className={cx(styles.actionIcon({ size }), className)}
          style={{ ...css_vars, ...style } as MotionStyle}
          data-hovered={isHovered ? "true" : undefined}
          data-pressed={isPressed ? "true" : undefined}
          data-focus-visible={isFocusVisible ? "true" : undefined}
          data-disabled={is_disabled ? "true" : undefined}
          data-loading={loading ? "true" : undefined}
          data-variant={variant}
          aria-busy={loading || undefined}
          animate={{ scale: is_animated && isPressed ? PRESS_SCALE : 1 }}
          transition={
            is_animated
              ? {
                  type: "spring",
                  stiffness: spring.stiffness,
                  damping: spring.damping,
                  mass: spring.mass,
                }
              : { duration: 0 }
          }
        >
          {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
          <span className={cx(styles.iconWrap, loading && styles.iconLoading)} aria-hidden="true">
            {children}
          </span>
        </m.button>
      </LazyMotion>
    );
  },
);

ActionIcon.displayName = "ActionIcon";
