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

import { grain, noiseOpacity } from "../../styles/noise.css.js";
import { ResolveGradient } from "../../theme/resolve-variant.js";
import { cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./GradientBackground.css.js";
import type {
  GradientBackgroundOwnProps,
  GradientBackgroundProps,
} from "./GradientBackground.types.js";
import { gradientImage, scrimAlpha } from "./GradientBackground.vars.css.js";

const GradientBackgroundComponent = forwardRef<HTMLElement, GradientBackgroundOwnProps>(
  function GradientBackground(props, ref) {
    const {
      component,
      gradient = "brand",
      radius = "lg",
      scrim = 0,
      grain: with_grain = false,
      className,
      style,
      children,
      ...rest
    } = props as GradientBackgroundOwnProps & { style?: CSSProperties };

    const { theme } = useTheme();
    const grain_opacity = theme.effects.glass.enabled ? theme.effects.glass.noiseOpacity : 0;

    const css_vars = assignInlineVars({
      [gradientImage]: ResolveGradient(gradient, theme),
      [scrimAlpha]: String(scrim),
      [noiseOpacity]: String(grain_opacity),
    });

    const named_radius = typeof radius === "string" ? radius : "lg";
    const inline_radius: CSSProperties =
      typeof radius === "number" ? { borderRadius: LengthToCss(radius) } : {};

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(styles.gradientBackground({ radius: named_radius }), className)}
        style={{ ...css_vars, ...inline_radius, ...style }}
        data-scrim={scrim > 0 ? String(scrim) : undefined}
        {...rest}
      >
        {scrim > 0 ? <span className={styles.scrim} aria-hidden="true" /> : null}
        {with_grain && grain_opacity > 0 ? (
          <span className={cx(grain, styles.grainLayer)} aria-hidden="true" />
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
