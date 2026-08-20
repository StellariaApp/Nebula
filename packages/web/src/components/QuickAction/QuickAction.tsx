"use client";

import {
  forwardRef,
  useMemo,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type Ref,
} from "react";

import { usePermissionGranted, useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { mergeProps, useButton, useFocusRing, useHover, useLink, useObjectRef } from "react-aria";

import { ResolveVariant, VariantRefs } from "@stellaria/nebula-themes/web";
import { PressProps } from "../../utils/press-props.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./QuickAction.css.js";
import type { QuickActionProps } from "./QuickAction.types.js";
import * as variables from "./QuickAction.vars.css.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";


export const QuickAction = forwardRef<HTMLElement, QuickActionProps>(
  function QuickAction(props, forwardedRef) {
    const {
      label,
      icon,
      description,
      variant = "light",
      color = "primary",
      gradient,
      glass,
      size = "md",
      r = "lg",
      orientation = "vertical",
      badge,
      disabled = false,
      loading = false,
      fullWidth = false,
      href,
      target,
      rel,
      permission,
      permissionMode = "hide",
      className,
      badgeProps,
      iconProps,
      bodyProps,
      labelProps,
      descriptionProps,
      style,
      ...rest
    } = props;

    const { theme } = useTheme();
    const local_ref = useRef<HTMLElement>(null);
    const ref = useObjectRef<HTMLElement>(forwardedRef ?? local_ref);
    const granted = usePermissionGranted(permission);
    const denied = !granted;
    const is_disabled = disabled || loading || (denied && permissionMode === "disable");
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
    } = ExtractStyleProps({ r, ...style_and_rest });

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

    // `prefers-reduced-motion` ya no se consulta aqui: lo lleva la hoja, que ademas no necesita
    // un listener por baldosa. Aqui queda lo que el CSS no puede saber.
    const is_animated = resolved.animated && !is_disabled;
    const lifts_on_hover = resolved.background === resolved.backgroundHover;
    const glow_idle =
      variant === "glow" &&
      resolved.glow !== "none" &&
      resolved.animated;

    const dom_props = mergeProps(
      is_link ? linkProps : buttonProps,
      hoverProps,
      focusProps,
      dom_rest,
    );

    const shared = {
      className: cx(styles.tile({ orientation, size, fullWidth }), sprinkle_class, className),
      style: { ...css_vars, ...sprinkle_style, ...style },
      "data-hovered": isHovered ? "true" : undefined,
      "data-pressed": is_pressed ? "true" : undefined,
      "data-focus-visible": isFocusVisible ? "true" : undefined,
      "data-disabled": is_disabled ? "true" : undefined,
      "data-loading": loading ? "true" : undefined,
      "data-variant": variant,
      "data-glow-idle": glow_idle ? "true" : undefined,
      "data-animated": is_animated ? "true" : undefined,
      "data-lifts": lifts_on_hover ? "true" : undefined,
      "aria-busy": loading || undefined,
    };

    const content = (
      <>
        {badge === undefined || badge === null ? null : (
          <Box component="span" {...badgeProps} className={cx(styles.badge, badgeProps?.className)}>
            {badge}
          </Box>
        )}
        {icon === undefined || icon === null ? null : (
          <Box
            component="span"
            aria-hidden="true"
            {...iconProps}
            className={cx(styles.icon({ size }), iconProps?.className)}
          >
            {icon}
          </Box>
        )}
        <Box component="span" {...bodyProps} className={cx(styles.body, bodyProps?.className)}>
          <Text
            component="span"
            {...labelProps}
            className={cx(styles.label, labelProps?.className)}
          >
            {label}
          </Text>
          {description === undefined || description === null ? null : (
            <Text
              component="span"
              {...descriptionProps}
              className={cx(styles.description, descriptionProps?.className)}
            >
              {description}
            </Text>
          )}
        </Box>
      </>
    );

    if (denied && permissionMode === "hide") return null;

    return is_link ? (
      <a
        {...(dom_props)}
        {...shared}
        ref={ref as Ref<HTMLAnchorElement>}
      >
        {content}
      </a>
    ) : (
      <button
        {...(dom_props)}
        {...shared}
        ref={ref as Ref<HTMLButtonElement>}
      >
        {content}
      </button>
    );
  },
);

QuickAction.displayName = "QuickAction";
