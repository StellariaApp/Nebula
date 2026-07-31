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

import { vars } from "../../theme/contract.css.js";
import { ResolveGradient, ResolveGradientEdge } from "../../theme/resolve-variant.js";
import { cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./GradientBorder.css.js";
import type { GradientBorderOwnProps, GradientBorderProps } from "./GradientBorder.types.js";
import { fallbackBorder, gradientImage, innerBg, ringWidth } from "./GradientBorder.vars.css.js";

const GradientBorderComponent = forwardRef<HTMLElement, GradientBorderOwnProps>(
  function GradientBorder(props, ref) {
    const {
      component,
      gradient = "brand",
      width = 1,
      radius = "lg",
      surface = "none",
      className,
      style,
      children,
      ...rest
    } = props as GradientBorderOwnProps & { style?: CSSProperties };

    const { theme } = useTheme();

    const css_vars = assignInlineVars({
      [gradientImage]: ResolveGradient(gradient, theme),
      [ringWidth]: LengthToCss(width),
      [innerBg]: surface === "none" ? "transparent" : vars.color.surface[surface],
      [fallbackBorder]: ResolveGradientEdge(gradient, theme),
    });

    const named_radius = typeof radius === "string" ? radius : "lg";
    const inline_radius: CSSProperties =
      typeof radius === "number" ? { borderRadius: LengthToCss(radius) } : {};

    return (
      <Box
        ref={ref}
        component={component ?? "div"}
        className={cx(styles.gradientBorder({ radius: named_radius }), className)}
        style={{ ...css_vars, ...inline_radius, ...style }}
        data-surface={surface}
        {...rest}
      >
        {children}
      </Box>
    );
  },
);

interface GradientBorderComponent {
  <C extends ElementType = "div">(
    props: GradientBorderProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const GradientBorder = GradientBorderComponent as unknown as GradientBorderComponent;
GradientBorder.displayName = "GradientBorder";
