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
import { ResolveGradientToken } from "../../theme/resolve-variant.js";
import { MeshBase, MeshCss } from "../../utils/effects.js";
import { cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./MeshGradientBg.css.js";
import type { MeshGradientBgOwnProps, MeshGradientBgProps } from "./MeshGradientBg.types.js";
import { meshBase, meshImage, scrimAlpha } from "./MeshGradientBg.vars.css.js";

const MeshGradientBgComponent = forwardRef<HTMLElement, MeshGradientBgOwnProps>(
  function MeshGradientBg(props, ref) {
    const {
      component,
      gradient = "brand",
      radius = "lg",
      grain: with_grain = false,
      scrim = 0,
      className,
      style,
      children,
      ...rest
    } = props as MeshGradientBgOwnProps & { style?: CSSProperties };

    const { theme } = useTheme();
    const token = ResolveGradientToken(gradient, theme);
    const grain_opacity = theme.effects.glass.enabled ? theme.effects.glass.noiseOpacity : 0;

    const css_vars = assignInlineVars({
      [meshImage]: token === undefined ? "none" : MeshCss(token),
      [meshBase]: token === undefined ? "transparent" : MeshBase(token),
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
        className={cx(styles.meshGradientBg({ radius: named_radius }), className)}
        style={{ ...css_vars, ...inline_radius, ...style }}
        data-gradient={gradient}
        data-grain={with_grain && grain_opacity > 0 ? "on" : "off"}
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

interface MeshGradientBgComponent {
  <C extends ElementType = "div">(
    props: MeshGradientBgProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const MeshGradientBg = MeshGradientBgComponent as unknown as MeshGradientBgComponent;
MeshGradientBg.displayName = "MeshGradientBg";
