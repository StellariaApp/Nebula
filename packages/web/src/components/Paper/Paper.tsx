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

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Paper.css.js";
import type { PaperOwnProps, PaperProps } from "./Paper.types.js";
import { backdropFilter, bg, borderColor, fg, glow } from "./Paper.vars.css.js";

const PaperComponent = forwardRef<HTMLElement, PaperOwnProps>(function Paper(props, ref) {
  const {
    component,
    shadow = "none",
    radius = "md",
    withBorder = false,
    variant,
    color = "primary",
    className,
    style,
    children,
    ...rest
  } = props as PaperOwnProps & { style?: CSSProperties };

  const { theme } = useTheme();
  const resolved = variant === undefined ? null : ResolveVariant(variant, color, theme, undefined, "subtle");

  const named_radius = typeof radius === "string" ? radius : "md";
  const inline_radius: CSSProperties =
    typeof radius === "number" ? { borderRadius: LengthToCss(radius) } : {};

  const css_vars =
    resolved === null
      ? {}
      : assignInlineVars({
          [bg]: resolved.background,
          [fg]: resolved.foreground,
          [borderColor]: resolved.borderColor,
          [backdropFilter]: resolved.backdropFilter,
          [glow]: resolved.glow,
        });

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      className={cx(
        styles.paper({
          shadow,
          radius: named_radius,
          withBorder: withBorder || resolved?.borderWidth === "1px",
          glowing: resolved !== null && resolved.glow !== "none",
        }),
        className,
      )}
      style={{ ...css_vars, ...inline_radius, ...style }}
      data-variant={variant}
      {...rest}
    >
      {children}
    </Box>
  );
});

interface PaperComponent {
  <C extends ElementType = "div">(props: PaperProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Paper = PaperComponent as unknown as PaperComponent;
Paper.displayName = "Paper";
