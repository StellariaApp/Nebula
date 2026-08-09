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
import { ResolveGradientToken } from "../../theme/resolve-variant.js";
import { MeshBase, MeshCss } from "../../utils/effects.js";
import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./MeshGradientBg.css.js";
import type { MeshGradientBgOwnProps, MeshGradientBgProps } from "./MeshGradientBg.types.js";
import * as variables from "./MeshGradientBg.vars.css.js";

const MeshGradientBgComponent = forwardRef<HTMLElement, MeshGradientBgOwnProps>(
  function MeshGradientBg(props, ref) {
    const {
      component,
      gradient = "brand",
      r = "lg",
      grain: with_grain = false,
      scrim = 0,
      scrimProps,
      className,
      style,
      children,
      ...rest
    } = props as MeshGradientBgOwnProps & { style?: CSSProperties };

    const { theme } = useTheme();
    const token = ResolveGradientToken(gradient, theme);
    const grain_opacity = theme.effects.glass.enabled ? theme.effects.glass.noiseOpacity : 0;

    const css_vars = assignInlineVars({
      [variables.image]: token === undefined ? "none" : MeshCss(token),
      [variables.base]: token === undefined ? "transparent" : MeshBase(token),
      [variables.scrimAlpha]: String(scrim),
      [noise_vars.opacity]: String(grain_opacity),
    });

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        r={r}
        className={cx(styles.mesh_gradient_bg(), className)}
        style={{ ...css_vars, ...style }}
        data-gradient={gradient}
        data-grain={with_grain && grain_opacity > 0 ? "on" : "off"}
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

interface MeshGradientBgComponent {
  <C extends ElementType = "div">(
    props: MeshGradientBgProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const MeshGradientBg = MeshGradientBgComponent as unknown as MeshGradientBgComponent;
MeshGradientBg.displayName = "MeshGradientBg";
