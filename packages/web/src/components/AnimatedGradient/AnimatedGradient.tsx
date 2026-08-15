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
import { Box } from "../Box/Box.js";

import * as styles from "./AnimatedGradient.css.js";
import type { AnimatedGradientOwnProps, AnimatedGradientProps } from "./AnimatedGradient.types.js";
import * as variables from "./AnimatedGradient.vars.css.js";

const AnimatedGradientComponent = forwardRef<HTMLElement, AnimatedGradientOwnProps>(
  function AnimatedGradient(props, ref) {
    const {
      component,
      gradient = "brand",
      r = "lg",
      speed = "base",
      scrim = 0,
      scrimProps,
      className,
      style,
      children,
      ...rest
    } = props as AnimatedGradientOwnProps & { style?: CSSProperties };

    const { theme } = useTheme();
    const animated = theme.motion.tier !== "minimal";

    const css_vars = assignInlineVars({
      [variables.gradientImage]: ResolveGradient(gradient, theme),
      [variables.scrimAlpha]: String(scrim),
    });

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        r={r}
        className={cx(styles.animated_gradient(), className)}
        style={{ ...css_vars, ...style }}
        data-animated={animated ? "true" : "false"}
        {...rest}
      >
        <span className={styles.drift_frame} aria-hidden="true">
          <span
            className={cx(styles.drift, styles.speed[speed])}
            data-animated={animated ? "true" : "false"}
          />
        </span>
        {scrim > 0 ? (
          <Box
            component="span"
            aria-hidden="true"
            {...scrimProps}
            className={cx(styles.scrim, scrimProps?.className)}
          />
        ) : null}
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
