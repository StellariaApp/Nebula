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

import { grain } from "../../styles/noise.css.js";
import * as noise_vars from "../../styles/noise.vars.css.js";
import { ResolveGradient } from "../../theme/resolve-variant.js";
import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./GradientBackground.css.js";
import type {
  GradientBackgroundOwnProps,
  GradientBackgroundProps,
} from "./GradientBackground.types.js";
import * as variables from "./GradientBackground.vars.css.js";

const GradientBackgroundComponent = forwardRef<HTMLElement, GradientBackgroundOwnProps>(
  function GradientBackground(props, ref) {
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
      [variables.image]: ResolveGradient(gradient, theme),
      [variables.scrimAlpha]: String(scrim),
      [noise_vars.opacity]: String(grain_opacity),
    });

    return (
      <Box
        ref={ref}
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
  },
);

interface GradientBackgroundComponent {
  <C extends ElementType = "div">(
    props: GradientBackgroundProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const GradientBackground =
  GradientBackgroundComponent as unknown as GradientBackgroundComponent;
GradientBackground.displayName = "GradientBackground";
