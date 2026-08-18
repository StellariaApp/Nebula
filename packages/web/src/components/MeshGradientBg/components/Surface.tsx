"use client";

import type { CSSProperties, ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { grain } from "../../../styles/noise.css.js";
import * as noise_vars from "../../../styles/noise.vars.css.js";
import { GradientRefsOf, ResolveGradientToken } from "@stellaria/nebula-themes/web";
import { MeshBase, MeshBaseFromRef, MeshCss, MeshCssFromRefs } from "../../../utils/effects.js";
import { cx } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../MeshGradientBg.css.js";
import type { MeshGradientBgOwnProps } from "../MeshGradientBg.types.js";
import * as variables from "../MeshGradientBg.vars.css.js";

/**
 * El nodo que pinta la malla, y lo único que necesita el tema en runtime.
 *
 * Recibe el contenido como `children` para que `MeshGradientBg` pueda ser de servidor: lo que un
 * componente de servidor pasa como `children` a uno de cliente sigue siendo de servidor (ADR-157).
 */
export function MeshGradientBgSurface(props: MeshGradientBgOwnProps): ReactElement {
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
  // Dos paradas es lo que ciclar necesita para alternar edge y tip (ADR-171). Con otro numero, la
  // malla se construye aqui, como todas las demas escotillas.
  const refs = token?.stops.length === 2 ? GradientRefsOf(gradient) : undefined;
  const grain_opacity = theme.effects.glass.enabled ? theme.effects.glass.noiseOpacity : 0;

  const css_vars = assignInlineVars({
    [variables.image]:
      refs !== undefined
        ? MeshCssFromRefs(refs.edge, refs.tip)
        : token === undefined
          ? "none"
          : MeshCss(token),
    [variables.base]:
      refs !== undefined
        ? MeshBaseFromRef(refs.tip)
        : token === undefined
          ? "transparent"
          : MeshBase(token),
    [variables.scrimAlpha]: String(scrim),
    [noise_vars.opacity]: String(grain_opacity),
  });

  return (
    <Box
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
}

MeshGradientBgSurface.displayName = "MeshGradientBg.Surface";
