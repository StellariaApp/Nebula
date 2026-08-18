"use client";

import type { CSSProperties, ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveGradient } from "@stellaria/nebula-themes/web";
import { cx } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../AnimatedGradient.css.js";
import type { AnimatedGradientOwnProps } from "../AnimatedGradient.types.js";
import * as variables from "../AnimatedGradient.vars.css.js";

/**
 * El nodo que pinta el degradado, y lo único que necesita el tema en runtime.
 *
 * Recibe el contenido como `children` para que `AnimatedGradient` pueda ser de servidor: lo que un
 * componente de servidor pasa como `children` a uno de cliente sigue siendo de servidor (ADR-157).
 */
export function AnimatedGradientSurface(props: AnimatedGradientOwnProps): ReactElement {
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
}

AnimatedGradientSurface.displayName = "AnimatedGradient.Surface";
