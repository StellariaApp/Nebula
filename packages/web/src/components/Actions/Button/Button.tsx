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
  LazyMotion,
  domAnimation,
  m,
  useReducedMotion,
  type HTMLMotionProps,
  type MotionStyle,
} from "motion/react";
import { mergeProps, useButton, useFocusRing, useHover, useObjectRef } from "react-aria";

import { resolveVariant } from "../../../theme/resolve-variant.js";
import { cx } from "../../../utils/style-props.js";

import * as styles from "./Button.css.js";
import type { ButtonProps } from "./Button.types.js";
import {
  backdropFilter,
  bg,
  bgActive,
  bgHover,
  borderColor,
  borderWidth,
  fg,
  glow,
} from "./Button.vars.css.js";

/**
 * Button — plantilla canónica de las tres capas (docs/01 §4, ADR-018):
 *
 * 1. **Comportamiento/a11y**: `useButton` + `useHover` + `useFocusRing` de React
 *    Aria (role, Enter/Space, focus visible real, estado disabled anunciado).
 * 2. **Visual**: `recipe()` de VE para la estructura + vars locales resueltas
 *    desde `theme.variantMap` — las 8 variantes son temables sin tocar código.
 * 3. **Motion**: spring del theme (`motion.spring.default`) sobre `transform`,
 *    con `useReducedMotion` y el interruptor `motion.tier: "minimal"`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, forwardedRef) {
  const {
    variant = "filled",
    size = "md",
    color = "primary",
    disabled = false,
    loading = false,
    fullWidth = false,
    leftSection,
    rightSection,
    children,
    className,
    style,
    ...rest
  } = props;

  const { theme } = useTheme();
  const localRef = useRef<HTMLButtonElement>(null);
  const ref = useObjectRef(forwardedRef ?? localRef);
  const prefersReduced = useReducedMotion();

  const isDisabled = disabled || loading;

  // `onClick`/`onPress` se entregan A React Aria (que los trata como el mismo
  // handler, ver PressEvents): así la activación por teclado (Enter/Space del
  // patrón APG) invoca la acción igual que el puntero. Pasarlos al DOM por
  // separado los rompería, porque Aria gobierna el press.
  const { onClick, onPress, type, ...domRest } = rest;
  const { buttonProps, isPressed } = useButton(
    {
      isDisabled,
      elementType: "button",
      type: type ?? "button",
      // React Aria tipa el evento sobre `FocusableElement` (genérico) y React
      // sobre `HTMLButtonElement`; en runtime el target ES el <button>.
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
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const { focusProps, isFocusVisible } = useFocusRing();

  const resolved = useMemo(() => resolveVariant(variant, color, theme), [variant, color, theme]);

  const cssVars = useMemo<CSSProperties>(
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

  // El spring del theme alimenta motion con los MISMOS números que Reanimated
  // en native (ADR-018 §1). `tier: "minimal"` y reduced-motion lo desactivan.
  const spring = theme.motion.spring.default;
  const animate = resolved.animated && prefersReduced !== true && !isDisabled;

  /**
   * Frontera de framework documentada (presupuesto de casts, skill
   * typescript-strict): React Aria tipa sus handlers como eventos DOM
   * (`DOMAttributes`) y `motion` redefine `onAnimationStart`/`onDrag*` con su
   * propia firma. Ambos tipos son estructuralmente incompatibles por diseño; el
   * objeto resultante es válido en runtime para un `<button>`.
   */
  const domProps = mergeProps(buttonProps, hoverProps, focusProps, domRest) as unknown as Omit<
    HTMLMotionProps<"button">,
    "style"
  >;

  return (
    <LazyMotion features={domAnimation} strict>
      <m.button
        {...domProps}
        ref={ref}
        className={cx(styles.button({ size, fullWidth }), className)}
        // Frontera de tipos: MotionStyle no declara `| undefined` en sus props,
        // incompatible con `exactOptionalPropertyTypes`. El objeto es un
        // CSSProperties válido.
        style={{ ...cssVars, ...style } as MotionStyle}
        data-hovered={isHovered ? "true" : undefined}
        data-pressed={isPressed ? "true" : undefined}
        data-focus-visible={isFocusVisible ? "true" : undefined}
        data-disabled={isDisabled ? "true" : undefined}
        data-loading={loading ? "true" : undefined}
        data-variant={variant}
        aria-busy={loading || undefined}
        animate={{ scale: animate && isPressed ? 0.98 : 1 }}
        transition={
          animate
            ? { type: "spring", stiffness: spring.stiffness, damping: spring.damping, mass: spring.mass }
            : { duration: 0 }
        }
      >
        {loading ? <span className={styles.spinner} aria-hidden="true" /> : null}
        {leftSection === undefined ? null : (
          <span className={cx(styles.section, loading && styles.labelLoading)} aria-hidden="true">
            {leftSection}
          </span>
        )}
        <span className={cx(loading && styles.labelLoading)}>{children}</span>
        {rightSection === undefined ? null : (
          <span className={cx(styles.section, loading && styles.labelLoading)} aria-hidden="true">
            {rightSection}
          </span>
        )}
      </m.button>
    </LazyMotion>
  );
});

Button.displayName = "Button";
