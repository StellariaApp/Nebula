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

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";
import { Spring } from "../../utils/motion.js";
import { PressProps } from "../../utils/press-props.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./ActionIcon.css.js";
import type { ActionIconProps } from "./ActionIcon.types.js";
import * as variables from "./ActionIcon.vars.css.js";

const PRESS_SCALE = 0.94;
const HOVER_LIFT = -2;

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

    /**
     * El color sale de la matriz que el tema publica, no de resolverlo aqui (ADR-150 §2).
     *
     * Con refs, lo que viaja al `style` es `var(--variant-…)` y quien lo resuelve es el navegador
     * contra la clase activa. Sin ellas el servidor horneaba el color del tema por defecto y el
     * cliente lo recalculaba al adoptar el suyo, que es por lo que los degradados tardaban en
     * mostrar su color real.
     *
     * `resolved` sigue haciendo falta para lo que no es color —si anima, si el degradado anima, si
     * el resplandor existe—, y eso no se ve hasta despues de hidratar.
     */
    const refs = VariantRefs(variant, color, theme, gradient, glass);

    const css_vars = useMemo<CSSProperties>(
      () =>
        assignInlineVars({
          [variables.bg]: refs?.background ?? resolved.background,
          [variables.bgHover]: refs?.backgroundHover ?? resolved.backgroundHover,
          [variables.bgActive]: refs?.backgroundActive ?? resolved.backgroundActive,
          [variables.fg]: refs?.foreground ?? resolved.foreground,
          [variables.borderColor]: refs?.borderColor ?? resolved.borderColor,
          [variables.borderWidth]: refs?.borderWidth ?? resolved.borderWidth,
          [variables.backdropFilter]: refs?.backdropFilter ?? resolved.backdropFilter,
          [variables.glow]: refs?.glow ?? resolved.glow,
        }),
      [refs, resolved],
    );

    const is_animated = resolved.animated && prefers_reduced !== true && !is_disabled;
    const lifts_on_hover = resolved.background === resolved.backgroundHover;
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
        animate={{
          scale: is_animated && isPressed ? PRESS_SCALE : 1,
          y: is_animated && isHovered && !isPressed && lifts_on_hover ? HOVER_LIFT : 0,
        }}
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
