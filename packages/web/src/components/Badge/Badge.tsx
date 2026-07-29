"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { ScaleShade } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Badge.css.js";
import type { BadgeProps } from "./Badge.types.js";
import { bg, borderColor, fg } from "./Badge.vars.css.js";

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
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [bg]: resolved.background,
    [fg]: resolved.foreground,
    [borderColor]: resolved.borderColor,
  });

  return (
    <span
      className={cx(styles.badge({ size, radius, fullWidth }), sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-variant={variant}
      data-dot={dot ? "true" : undefined}
    >
      {dot ? (
        <span
          className={styles.dot}
          style={{ color: ScaleShade(color, "600") }}
          aria-hidden="true"
        />
      ) : null}
      {leftSection === undefined || leftSection === null ? null : (
        <span className={styles.section} aria-hidden="true">
          {leftSection}
        </span>
      )}
      {children}
      {rightSection === undefined || rightSection === null ? null : (
        <span className={styles.section}>{rightSection}</span>
      )}
    </span>
  );
}

Badge.displayName = "Badge";
