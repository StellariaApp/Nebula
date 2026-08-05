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

import { ResolveGradient } from "../../theme/resolve-variant.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./GradientText.css.js";
import * as variables from "./GradientText.vars.css.js";
import type { GradientTextOwnProps, GradientTextProps } from "./GradientText.types.js";

const GradientTextComponent = forwardRef<HTMLElement, GradientTextOwnProps>(
  function GradientText(props, ref) {
    const {
      component,
      gradient = "brand",
      fallbackColor = "text.primary",
      inherit,
      className,
      style,
      ...rest
    } = props as GradientTextOwnProps & { style?: CSSProperties };

    const { theme } = useTheme();
    const fallback = ResolveAccent(fallbackColor, "600");

    const css_vars = assignInlineVars({
      [variables.image]: ResolveGradient(gradient, theme),
      [variables.fallbackFg]: fallback,
    });

    return (
      <Box
        ref={ref}
        component={component ?? "span"}
        className={cx(styles.gradient_text, inherit === true && styles.inherit_styles, className)}
        style={{ ...css_vars, ...style }}
        {...rest}
      />
    );
  },
);

interface GradientTextComponent {
  <C extends ElementType = "span">(
    props: GradientTextProps<C> & { ref?: Ref<Element> },
  ): ReactElement;
  displayName?: string;
}

export const GradientText = GradientTextComponent as unknown as GradientTextComponent;
GradientText.displayName = "GradientText";
