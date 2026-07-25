import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { ScaleShade } from "../../utils/scale.js";
import { cx } from "../../utils/style-props.js";

import * as styles from "./Badge.css.js";
import type { BadgeProps, BadgeVariant } from "./Badge.types.js";
import { bg, borderColor, fg } from "./Badge.vars.css.js";

function Palette(
  variant: BadgeVariant,
  color: NonNullable<BadgeProps["color"]>,
): { bg: string; fg: string; border: string } {
  if (variant === "filled") {
    return { bg: ScaleShade(color, "600"), fg: vars.color.text.onPrimary, border: "transparent" };
  }
  if (variant === "outline") {
    return { bg: "transparent", fg: ScaleShade(color, "700"), border: ScaleShade(color, "500") };
  }
  if (variant === "dot") {
    return {
      bg: vars.color.surface.raised,
      fg: vars.color.text.primary,
      border: vars.color.border.default,
    };
  }
  return {
    bg: `color-mix(in srgb, ${ScaleShade(color, "500")} 14%, transparent)`,
    fg: ScaleShade(color, "700"),
    border: "transparent",
  };
}

export function Badge(props: BadgeProps): ReactElement {
  const {
    children,
    variant = "light",
    color = "primary",
    size = "md",
    radius = "full",
    leftSection,
    rightSection,
    fullWidth = false,
    className,
  } = props;

  const palette = Palette(variant, color);

  const css_vars = assignInlineVars({
    [bg]: palette.bg,
    [fg]: palette.fg,
    [borderColor]: palette.border,
  });

  return (
    <span
      className={cx(styles.badge({ size, radius, fullWidth }), className)}
      style={css_vars}
      data-variant={variant}
    >
      {variant === "dot" ? (
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
