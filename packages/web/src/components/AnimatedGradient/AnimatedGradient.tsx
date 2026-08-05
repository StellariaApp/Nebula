"use client";

import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveGradient } from "../../theme/resolve-variant.js";
import { cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./AnimatedGradient.css.js";
import type { AnimatedGradientOwnProps, AnimatedGradientProps } from "./AnimatedGradient.types.js";
import { gradientImage, scrimAlpha } from "./AnimatedGradient.vars.css.js";

const AnimatedGradientComponent = forwardRef<HTMLElement, AnimatedGradientOwnProps>(
  function AnimatedGradient(props, ref) {
    const {
      component,
      gradient = "brand",
      radius = "lg",
      speed = "base",
      scrim = 0,
      className,
      style,
      children,
      ...rest
    } = props as AnimatedGradientOwnProps & { style?: CSSProperties };

    const { theme } = useTheme();
    const animated = theme.motion.tier !== "minimal";

    const css_vars = assignInlineVars({
      [gradientImage]: ResolveGradient(gradient, theme),
      [scrimAlpha]: String(scrim),
    });

    const named_radius = typeof radius === "string" ? radius : "lg";
    const inline_radius: CSSProperties =
      typeof radius === "number" ? { borderRadius: LengthToCss(radius) } : {};

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(styles.animated_gradient({ radius: named_radius }), className)}
        style={{ ...css_vars, ...inline_radius, ...style }}
        data-animated={animated ? "true" : "false"}
        {...rest}
      >
        <span
          className={cx(styles.drift, styles.speed[speed])}
          data-animated={animated ? "true" : "false"}
          aria-hidden="true"
        />
        {scrim > 0 ? <span className={styles.scrim} aria-hidden="true" /> : null}
        {children}
      </Box>
    );
  },
);

interface AnimatedGradientComponent {
  <C extends ElementType = "div">(
    props: AnimatedGradientProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const AnimatedGradient = AnimatedGradientComponent as unknown as AnimatedGradientComponent;
AnimatedGradient.displayName = "AnimatedGradient";
