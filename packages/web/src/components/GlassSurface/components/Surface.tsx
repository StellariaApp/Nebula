"use client";

import type { CSSProperties, ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { grain } from "../../../styles/noise.css.js";
import { vars } from "@stellaria/nebula-themes/web";
import { cx } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../GlassSurface.css.js";
import type { GlassSurfaceOwnProps } from "../GlassSurface.types.js";
import * as variables from "../GlassSurface.vars.css.js";

/**
 * El cristal, y lo único que necesita el tema en runtime — `glass.enabled` es data no-CSS.
 *
 * Recibe el contenido como `children` para que `GlassSurface` pueda ser de servidor: lo que un
 * componente de servidor pasa como `children` a uno de cliente sigue siendo de servidor (ADR-157).
 */
export function GlassSurfaceRoot(props: GlassSurfaceOwnProps): ReactElement {
  const {
    component,
    level = "default",
    r = "lg",
    withBorder = true,
    noise = false,
    shadow = "none",
    fallbackSurface = "overlay",
    className,
    style,
    children,
    ...rest
  } = props as GlassSurfaceOwnProps & { style?: CSSProperties };

  const { theme } = useTheme();
  const enabled = theme.effects.glass.enabled;
  const solid = vars.color.surface[fallbackSurface];

  const css_vars = assignInlineVars({
    [variables.bg]: enabled ? vars.glass[level].background : solid,
    [variables.solidBg]: solid,
    [variables.borderColor]: enabled ? vars.glass[level].borderColor : vars.color.border.subtle,
    [variables.solidBorderColor]: vars.color.border.subtle,
    [variables.backdrop]: enabled ? vars.glass[level].backdropFilter : "none",
  });

  return (
    <Box
      component={component ?? "div"}
      r={r}
      className={cx(styles.glass_surface({ shadow, withBorder }), className)}
      style={{ ...css_vars, ...style }}
      data-glass={enabled ? "on" : "off"}
      data-level={level}
      {...rest}
    >
      {noise && enabled ? (
        <span className={cx(grain, styles.grain_layer)} aria-hidden="true" />
      ) : null}
      {children}
    </Box>
  );
}

GlassSurfaceRoot.displayName = "GlassSurface.Root";
