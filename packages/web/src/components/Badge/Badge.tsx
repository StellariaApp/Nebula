"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Badge.css.js";
import type { BadgeProps } from "./Badge.types.js";
import * as variables from "./Badge.vars.css.js";
import { Box } from "../Box/Box.js";

export function Badge(props: BadgeProps): ReactElement {
  const {
    children,
    variant = "light",
    dot = false,
    color = "primary",
    size = "md",
    radius = "full",
    leftSection,
    rightSection,
    fullWidth = false,
    className,
    dotProps,
    leftSectionProps,
    rightSectionProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.bg]: resolved.background,
    [variables.fg]: resolved.foreground,
    [variables.borderColor]: resolved.borderColor,
  });

  return (
    <span
      className={cx(styles.badge({ size, radius, fullWidth }), sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-variant={variant}
      data-dot={dot ? "true" : undefined}
    >
      {dot ? (
        <Box
          component="span"
          aria-hidden="true"
          {...dotProps}
          className={cx(styles.dot, dotProps?.className)}
          style={{ color: ResolveAccent(color, "600"), ...dotProps?.style }}
        />
      ) : null}
      {leftSection === undefined || leftSection === null ? null : (
        <Box
          component="span"
          aria-hidden="true"
          {...leftSectionProps}
          className={cx(styles.section, leftSectionProps?.className)}
        >
          {leftSection}
        </Box>
      )}
      {children}
      {rightSection === undefined || rightSection === null ? null : (
        <Box
          component="span"
          {...rightSectionProps}
          className={cx(styles.section, rightSectionProps?.className)}
        >
          {rightSection}
        </Box>
      )}
    </span>
  );
}

Badge.displayName = "Badge";
