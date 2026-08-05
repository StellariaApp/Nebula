"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./ThemeIcon.css.js";
import * as variables from "./ThemeIcon.vars.css.js";
import type { ThemeIconProps } from "./ThemeIcon.types.js";

export function ThemeIcon(props: ThemeIconProps): ReactElement {
  const {
    children,
    variant = "light",
    color = "primary",
    size = "md",
    radius = "md",
    label,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.bg]: resolved.background,
    [variables.fg]: resolved.foreground,
    [variables.borderColor]: resolved.borderColor,
    [variables.borderWidth]: resolved.borderWidth,
  });

  return (
    <span
      className={cx(
        styles.icon,
        styles.size[size],
        styles.radius[radius],
        sprinkle_class,
        className,
      )}
      style={{ ...css_vars, ...sprinkle_style }}
      data-variant={variant}
      {...(label === undefined ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
    >
      {children}
    </span>
  );
}

ThemeIcon.displayName = "ThemeIcon";
