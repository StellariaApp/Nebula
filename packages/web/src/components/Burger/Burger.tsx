"use client";

import { forwardRef, useRef, type MouseEvent as ReactMouseEvent } from "react";

import { useTheme, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { mergeProps, useButton, useFocusRing, useHover, useObjectRef } from "react-aria";

import { MotionOff } from "../../utils/motion.js";
import { PressProps } from "../../utils/press-props.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import {
  burger,
  line,
  shift as line_shift,
  size as size_variants,
  show_below as showBelowVariants,
} from "./Burger.css.js";
import * as variables from "./Burger.vars.css.js";
import type { BurgerProps } from "./Burger.types.js";

const SHIFT: Record<string, number> = { xs: 5, sm: 6, md: 7, lg: 9, xl: 11 };

export const Burger = forwardRef<HTMLButtonElement, BurgerProps>(
  function Burger(props, forwardedRef) {
    const {
      showBelow = "always",
      opened,
      defaultOpened = false,
      onChange,
      size = "md",
      color = "text.primary",
      disabled = false,
      openLabel = "Open menu",
      closeLabel = "Close menu",
      className,
      style,
      ...rest
    } = props;

    const { theme } = useTheme();
    const local_ref = useRef<HTMLButtonElement>(null);
    const ref = useObjectRef(forwardedRef ?? local_ref);
    const [is_open, set_open] = useUncontrolled(opened, defaultOpened, onChange);

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

    const { buttonProps } = useButton(
      {
        isDisabled: disabled,
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
          onPress: (event) => {
            set_open(!is_open);
            onPress?.(event);
          },
          onPressStart,
          onPressEnd,
          onPressUp,
          onPressChange,
          preventFocusOnPress,
        }),
      },
      ref,
    );
    const { hoverProps, isHovered } = useHover({ isDisabled: disabled });
    const { focusProps, isFocusVisible } = useFocusRing();

    // Solo el escalon del tema: `prefers-reduced-motion` lo lleva la hoja.
    const motion_context = { theme, reduced: false };
    const is_off = MotionOff(motion_context);
    const shift = SHIFT[size] ?? 7;

    const dom_props = mergeProps(buttonProps, hoverProps, focusProps, dom_rest);

    return (
      <button
        {...dom_props}
        ref={ref}
        className={cx(
          burger,
          size_variants[size],
          showBelowVariants[showBelow],
          sprinkle_class,
          className,
        )}
        style={{
          ...assignInlineVars({
            [variables.bar]: ResolveAccent(color, "600"),
            // Cuanto se separan las barras al cerrarse en aspa. Depende del tamaño, asi que no
            // puede vivir en la hoja: la hoja no sabe que tamaño le han pedido.
            [line_shift]: `${String(shift)}px`,
          }),
          ...sprinkle_style,
          ...style,
        }}
        data-hovered={isHovered ? "true" : undefined}
        data-focus-visible={isFocusVisible ? "true" : undefined}
        data-disabled={disabled ? "true" : undefined}
        data-opened={is_open ? "true" : undefined}
        data-motion={is_off ? "off" : undefined}
        aria-expanded={is_open}
        aria-label={is_open ? closeLabel : openLabel}
      >
        <span className={line} />
        <span className={line} />
        <span className={line} />
      </button>
    );
  },
);

Burger.displayName = "Burger";
