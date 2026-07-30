"use client";

import {
  forwardRef,
  useMemo,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type Ref,
} from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { m, useReducedMotion, type HTMLMotionProps, type MotionStyle } from "motion/react";
import { mergeProps, useButton, useFocusRing, useHover, useLink, useObjectRef } from "react-aria";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { Spring } from "../../utils/motion.js";
import { PressProps } from "../../utils/press-props.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./QuickAction.css.js";
import type { QuickActionProps } from "./QuickAction.types.js";
import {
  backdropFilter,
  bg,
  bgActive,
  bgHover,
  borderColor,
  borderWidth,
  fg,
  glow,
} from "./QuickAction.vars.css.js";

const PRESS_SCALE = 0.98;

export const QuickAction = forwardRef<HTMLElement, QuickActionProps>(
  function QuickAction(props, forwardedRef) {
    const {
      label,
      icon,
      description,
      variant = "light",
      color = "primary",
      gradient,
      size = "md",
      radius = "lg",
      orientation = "vertical",
      badge,
      disabled = false,
      loading = false,
      fullWidth = false,
      href,
      target,
      rel,
      className,
      style,
      ...rest
    } = props;

    const { theme } = useTheme();
    const local_ref = useRef<HTMLElement>(null);
    const ref = useObjectRef<HTMLElement>(forwardedRef ?? local_ref);
    const prefers_reduced = useReducedMotion();
    const is_disabled = disabled || loading;
    const is_link = href !== undefined && !is_disabled;

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

    const press_options = {
      isDisabled: is_disabled,
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
    };

    const { buttonProps, isPressed: button_pressed } = useButton(
      { ...press_options, elementType: "button", type: type ?? "button" },
      ref,
    );
    const { linkProps, isPressed: link_pressed } = useLink(
      {
        ...press_options,
        elementType: "a",
        ...(href === undefined ? {} : { href }),
        ...(target === undefined ? {} : { target }),
        ...(rel === undefined ? {} : { rel }),
      },
      ref,
    );

    const is_pressed = is_link ? link_pressed : button_pressed;
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

    const is_animated = resolved.animated && prefers_reduced !== true && !is_disabled;
    const glow_idle =
      variant === "glow" && resolved.glow !== "none" && resolved.animated && prefers_reduced !== true;

    const dom_props = mergeProps(is_link ? linkProps : buttonProps, hoverProps, focusProps, dom_rest);

    const shared = {
      className: cx(
        styles.tile({ orientation, size, radius, fullWidth }),
        sprinkle_class,
        className,
      ),
      style: { ...css_vars, ...sprinkle_style, ...style } as MotionStyle,
      "data-hovered": isHovered ? "true" : undefined,
      "data-pressed": is_pressed ? "true" : undefined,
      "data-focus-visible": isFocusVisible ? "true" : undefined,
      "data-disabled": is_disabled ? "true" : undefined,
      "data-loading": loading ? "true" : undefined,
      "data-variant": variant,
      "data-glow-idle": glow_idle ? "true" : undefined,
      "aria-busy": loading || undefined,
      animate: { scale: is_animated && is_pressed ? PRESS_SCALE : 1 },
      transition: Spring("default", { theme, reduced: !is_animated }),
    };

    const content = (
      <>
        {badge === undefined || badge === null ? null : (
          <span className={styles.badge}>{badge}</span>
        )}
        {icon === undefined || icon === null ? null : (
          <span className={styles.icon({ size })} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={styles.body}>
          <span className={styles.label}>{label}</span>
          {description === undefined || description === null ? null : (
            <span className={styles.description}>{description}</span>
          )}
        </span>
      </>
    );

    return is_link ? (
      <m.a
        {...(dom_props as unknown as Omit<HTMLMotionProps<"a">, "style">)}
        {...shared}
        ref={ref as Ref<HTMLAnchorElement>}
      >
        {content}
      </m.a>
    ) : (
      <m.button
        {...(dom_props as unknown as Omit<HTMLMotionProps<"button">, "style">)}
        {...shared}
        ref={ref as Ref<HTMLButtonElement>}
      >
        {content}
      </m.button>
    );
  },
);

QuickAction.displayName = "QuickAction";
