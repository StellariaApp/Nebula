"use client";

import type { CSSProperties, ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { grain } from "../../../styles/noise.css.js";
import * as noise_vars from "../../../styles/noise.vars.css.js";
import { GradientRefsOf, ResolveGradient } from "@stellaria/nebula-themes/web";
import { cx } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../GradientBackground.css.js";
import type { GradientBackgroundOwnProps } from "../GradientBackground.types.js";
import * as variables from "../GradientBackground.vars.css.js";

/**
 * El nodo que pinta el degradado, y lo único que necesita el tema en runtime.
 *
 * Recibe el contenido como `children` para que `GradientBackground` pueda ser de servidor: lo que un
 * componente de servidor pasa como `children` a uno de cliente sigue siendo de servidor (ADR-157).
 */
export function GradientBackgroundSurface(props: GradientBackgroundOwnProps): ReactElement {
  const {
    component,
    gradient = "brand",
    r = "lg",
    scrim = 0,
    scrimProps,
    grain: with_grain = false,
    className,
    style,
    children,
    ...rest
  } = props as GradientBackgroundOwnProps & { style?: CSSProperties };

  const { theme } = useTheme();
  const grain_opacity = theme.effects.glass.enabled ? theme.effects.glass.noiseOpacity : 0;

  const css_vars = assignInlineVars({
    [variables.image]: GradientRefsOf(gradient)?.image ?? ResolveGradient(gradient, theme),
    [variables.scrimAlpha]: String(scrim),
    [noise_vars.opacity]: String(grain_opacity),
  });

  return (
    <Box
      component={component ?? "div"}
      r={r}
      className={cx(styles.gradient_background(), className)}
      style={{ ...css_vars, ...style }}
      data-scrim={scrim > 0 ? String(scrim) : undefined}
      {...rest}
    >
      {scrim > 0 ? (
        <Box
          component="span"
          aria-hidden="true"
          {...scrimProps}
          className={cx(styles.scrim, scrimProps?.className)}
        />
      ) : null}
      {with_grain && grain_opacity > 0 ? (
        <span className={cx(grain, styles.grain_layer)} aria-hidden="true" />
      ) : null}
      {children}
    </Box>
  );
}

GradientBackgroundSurface.displayName = "GradientBackground.Surface";
