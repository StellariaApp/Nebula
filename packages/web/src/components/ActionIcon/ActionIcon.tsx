"use client";

import {
  forwardRef,
  useMemo,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { usePermissionGranted, useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m, useReducedMotion, type HTMLMotionProps, type MotionStyle } from "motion/react";
import { mergeProps, useButton, useFocusRing, useHover, useObjectRef } from "react-aria";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { Spring } from "../../utils/motion.js";
import { PressProps } from "../../utils/press-props.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./ActionIcon.css.js";
import type { ActionIconProps } from "./ActionIcon.types.js";
import * as variables from "./ActionIcon.vars.css.js";

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
      permission,
      permissionMode = "hide",
      children,
      className,
      style,
      glass,
      iconProps,
      ...rest
    } = props;

    const { theme } = useTheme();
    const local_ref = useRef<HTMLButtonElement>(null);
    const ref = useObjectRef(forwardedRef ?? local_ref);
    const prefers_reduced = useReducedMotion();
    const granted = usePermissionGranted(permission);
    const denied = !granted;
    const is_disabled = disabled || loading || (denied && permissionMode === "disable");

    const {
      onClick,
      onPress,
      onPressStart,
      onPressEnd,
      onPressUp,
      onPressChange,
      preventFocusOnPress,
      type,
      ...style_and_rest
    } = rest;
    const {
      className: sprinkle_class,
      style: sprinkle_style,
      rest: dom_rest,
    } = ExtractStyleProps(style_and_rest);
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
        ...PressProps({
          onPress,
          onPressStart,
          onPressEnd,
          onPressUp,
          onPressChange,
          preventFocusOnPress,
        }),
      },
      ref,
    );
    const { hoverProps, isHovered } = useHover({ isDisabled: is_disabled });
    const { focusProps, isFocusVisible } = useFocusRing();

    const resolved = useMemo(
      () => ResolveVariant(variant, color, theme, gradient, glass),
      [variant, color, theme, gradient, glass],
    );

    const css_vars = useMemo<CSSProperties>(
      () =>
        assignInlineVars({
          [variables.bg]: resolved.background,
          [variables.bgHover]: resolved.backgroundHover,
          [variables.bgActive]: resolved.backgroundActive,
          [variables.fg]: resolved.foreground,
          [variables.borderColor]: resolved.borderColor,
          [variables.borderWidth]: resolved.borderWidth,
          [variables.backdropFilter]: resolved.backdropFilter,
          [variables.glow]: resolved.glow,
        }),
      [resolved],
    );

    const is_animated = resolved.animated && prefers_reduced !== true && !is_disabled;
    const press_transition = Spring("default", { theme, reduced: !is_animated });

    const dom_props = mergeProps(buttonProps, hoverProps, focusProps, dom_rest) as unknown as Omit<
      HTMLMotionProps<"button">,
      "style"
    >;

    if (denied && permissionMode === "hide") return null;

    return (
      <m.button
        {...dom_props}
        ref={ref}
        className={cx(styles.action_icon({ size }), sprinkle_class, className)}
        style={{ ...css_vars, ...sprinkle_style, ...style } as MotionStyle}
        data-hovered={isHovered ? "true" : undefined}
        data-pressed={isPressed ? "true" : undefined}
        data-focus-visible={isFocusVisible ? "true" : undefined}
        data-disabled={is_disabled ? "true" : undefined}
        data-loading={loading ? "true" : undefined}
        data-variant={variant}
        aria-busy={loading || undefined}
        animate={{ scale: is_animated && isPressed ? PRESS_SCALE : 1 }}
        transition={press_transition}
      >
        {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
        <Box
          component="span"
          aria-hidden="true"
          {...iconProps}
          className={cx(styles.icon_wrap, loading && styles.icon_loading, iconProps?.className)}
        >
          {children}
        </Box>
      </m.button>
    );
  },
);

ActionIcon.displayName = "ActionIcon";
