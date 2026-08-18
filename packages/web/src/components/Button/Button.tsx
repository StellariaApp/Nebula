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
import { m, useReducedMotion, type HTMLMotionProps } from "motion/react";
import { mergeProps, useButton, useFocusRing, useHover, useObjectRef } from "react-aria";

import { ResolveVariant } from "@stellaria/nebula-themes/web";
import { Spring } from "../../utils/motion.js";
import { PressProps } from "../../utils/press-props.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

import * as styles from "./Button.css.js";
import type { ButtonProps } from "./Button.types.js";
import * as variables from "./Button.vars.css.js";

const PRESS_SCALE = 0.98;
const HOVER_LIFT = -2;

/**
 * Lo que `useButton` anade para emular un boton y que en un ancla con `href` sobra: el rol prestado,
 * el foco que el ancla ya trae, y el teclado —en un enlace, Espacio desplaza la pagina y no activa—.
 */
const BUTTON_ONLY = ["role", "tabIndex", "onKeyDown", "onKeyUp"] as const;

function WithoutButtonSemantics<T extends object>(props: T): T {
  const out = { ...props } as Record<string, unknown>;
  for (const key of BUTTON_ONLY) delete out[key];
  return out as T;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(props, forwardedRef) {
    const {
      component,
      variant = "filled",
      glass = "veil",
      size = "md",
      color = "primary",
      gradient,
      disabled = false,
      loading = false,
      fullWidth = false,
      leftSection,
      rightSection,
      leftSectionProps,
      rightSectionProps,
      labelProps,
      permission,
      permissionMode = "hide",
      children,
      className,
      style,
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
    const element = component ?? "button";
    const is_button = element === "button";
    /**
     * Un ancla con `href` ES un enlace: se queda con su rol nativo, con su foco nativo y sin el
     * manejador de Espacio, que en un enlace desplaza la pagina y no activa. Enter sigue navegando
     * por el navegador, asi que `onPress` tampoco se pierde.
     */
    const is_link = element === "a" && typeof style_and_rest["href"] === "string";
    const Root = useMemo(() => m.create(element), [element]);

    const { buttonProps, isPressed } = useButton(
      {
        isDisabled: is_disabled,
        elementType: typeof element === "string" ? element : "span",
        ...(is_button ? { type: type ?? "button" } : {}),
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
    const lifts_on_hover = resolved.background === resolved.backgroundHover;
    const press_transition = Spring("default", { theme, reduced: !is_animated });
    const glow_idle =
      variant === "glow" &&
      resolved.glow !== "none" &&
      resolved.animated &&
      prefers_reduced !== true;

    const dom_props = mergeProps(
      is_link ? WithoutButtonSemantics(buttonProps) : buttonProps,
      hoverProps,
      focusProps,
      dom_rest,
    ) as unknown as Omit<HTMLMotionProps<"button">, "style">;

    if (denied && permissionMode === "hide") return null;

    return (
      <Root
        {...dom_props}
        ref={ref}
        className={cx(styles.button({ size, fullWidth }), sprinkle_class, className)}
        style={{ ...css_vars, ...sprinkle_style, ...style }}
        data-hovered={isHovered ? "true" : undefined}
        data-pressed={isPressed ? "true" : undefined}
        data-focus-visible={isFocusVisible ? "true" : undefined}
        data-disabled={is_disabled ? "true" : undefined}
        data-loading={loading ? "true" : undefined}
        data-variant={variant}
        data-glow-idle={glow_idle ? "true" : undefined}
        data-gradient-animated={
          resolved.gradientAnimated && prefers_reduced !== true ? "true" : undefined
        }
        aria-busy={loading || undefined}
        animate={{
          scale: is_animated && isPressed ? PRESS_SCALE : 1,
          y: is_animated && isHovered && !isPressed && lifts_on_hover ? HOVER_LIFT : 0,
        }}
        transition={press_transition}
      >
        {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
        {leftSection === undefined ? null : (
          <Box
            component="span"
            aria-hidden="true"
            {...leftSectionProps}
            className={cx(
              styles.section,
              loading && styles.label_loading,
              leftSectionProps?.className,
            )}
          >
            {leftSection}
          </Box>
        )}
        <Text
          component="span"
          inherit
          {...labelProps}
          className={cx(loading && styles.label_loading, labelProps?.className)}
        >
          {children}
        </Text>
        {rightSection === undefined ? null : (
          <Box
            component="span"
            aria-hidden="true"
            {...rightSectionProps}
            className={cx(
              styles.section,
              loading && styles.label_loading,
              rightSectionProps?.className,
            )}
          >
            {rightSection}
          </Box>
        )}
      </Root>
    );
  },
);

Button.displayName = "Button";
