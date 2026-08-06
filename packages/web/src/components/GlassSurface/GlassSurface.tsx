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
import { vars } from "../../theme/contract.css.js";
import { cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./GlassSurface.css.js";
import type { GlassSurfaceOwnProps, GlassSurfaceProps } from "./GlassSurface.types.js";
import * as variables from "./GlassSurface.vars.css.js";

const GlassSurfaceComponent = forwardRef<HTMLElement, GlassSurfaceOwnProps>(
  function GlassSurface(props, ref) {
    const {
      component,
      level = "default",
      radius = "lg",
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
      [variables.borderRule]: enabled
        ? vars.glass[level].border
        : `1px solid ${vars.color.border.subtle}`,
      [variables.backdrop]: enabled ? vars.glass[level].backdropFilter : "none",
    });

    const named_radius = typeof radius === "string" ? radius : "lg";
    const inline_radius: CSSProperties =
      typeof radius === "number" ? { borderRadius: LengthToCss(radius) } : {};

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(
          styles.glass_surface({ shadow, radius: named_radius, withBorder }),
          className,
        )}
        style={{ ...css_vars, ...inline_radius, ...style }}
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
  },
);

interface GlassSurfaceComponent {
  <C extends ElementType = "div">(
    props: GlassSurfaceProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const GlassSurface = GlassSurfaceComponent as unknown as GlassSurfaceComponent;
GlassSurface.displayName = "GlassSurface";
