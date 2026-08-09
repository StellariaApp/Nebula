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
import { Box } from "../Box/Box.js";

import * as styles from "./Paper.css.js";
import type { PaperOwnProps, PaperProps } from "./Paper.types.js";
import * as variables from "./Paper.vars.css.js";

const PaperComponent = forwardRef<HTMLElement, PaperOwnProps>(function Paper(props, ref) {
  const {
    component,
    shadow = "none",
    r = "lg",
    withBorder = false,
    variant,
    color = "primary",
    className,
    style,
    children,
    ...rest
  } = props as PaperOwnProps & { style?: CSSProperties };

  const { theme } = useTheme();
  const resolved =
    variant === undefined ? null : ResolveVariant(variant, color, theme, undefined, "subtle");

  const css_vars =
    resolved === null
      ? {}
      : assignInlineVars({
          [variables.bg]: resolved.background,
          [variables.fg]: resolved.foreground,
          [variables.borderColor]: resolved.borderColor,
          [variables.backdropFilter]: resolved.backdropFilter,
          [variables.glow]: resolved.glow,
        });

  return (
    <Box
      ref={ref}
      component={component ?? "div"}
      r={r}
      className={cx(
        styles.paper({
          shadow,
          withBorder: withBorder || resolved?.borderWidth === "1px",
          glowing: resolved !== null && resolved.glow !== "none",
        }),
        className,
      )}
      style={{ ...css_vars, ...style }}
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
