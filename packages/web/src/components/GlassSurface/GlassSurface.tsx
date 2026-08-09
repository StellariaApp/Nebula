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
import { Box } from "../Box/Box.js";

import * as styles from "./GlassSurface.css.js";
import type { GlassSurfaceOwnProps, GlassSurfaceProps } from "./GlassSurface.types.js";
import * as variables from "./GlassSurface.vars.css.js";

const GlassSurfaceComponent = forwardRef<HTMLElement, GlassSurfaceOwnProps>(
  function GlassSurface(props, ref) {
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
      [variables.borderColor]: enabled
        ? vars.glass[level].borderColor
        : vars.color.border.subtle,
      [variables.solidBorderColor]: vars.color.border.subtle,
      [variables.backdrop]: enabled ? vars.glass[level].backdropFilter : "none",
    });

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        r={r}
        className={cx(
          styles.glass_surface({ shadow, withBorder }),
          className,
        )}
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
