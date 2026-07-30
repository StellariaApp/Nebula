"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";

import * as styles from "./Tag.css.js";
import { bg, borderColor, fg } from "./Tag.vars.css.js";
import type { TagProps } from "./Tag.types.js";

export function Tag(props: TagProps): ReactElement {
  const {
    children,
    variant = "light",
    color = "primary",
    size = "md",
    radius = "full",
    leftSection,
    onRemove,
    removeLabel = "Quitar",
    disabled = false,
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
      className={cx(styles.tag, styles.size[size], styles.radius[radius], sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      data-variant={variant}
      data-disabled={disabled ? "true" : undefined}
      {...(disabled ? { "aria-disabled": true } : {})}
    >
      {leftSection === undefined || leftSection === null ? null : (
        <span className={styles.section} aria-hidden="true">
          {leftSection}
        </span>
      )}
      <span className={styles.label}>{children}</span>
      {onRemove === undefined ? null : (
        <ButtonClose
          size={size === "xs" || size === "sm" ? "xs" : "sm"}
          aria-label={
            typeof children === "string" || typeof children === "number"
              ? `${removeLabel}: ${String(children)}`
              : removeLabel
          }
          disabled={disabled}
          className={styles.remove}
          onPress={onRemove}
        />
      )}
    </span>
  );
}

Tag.displayName = "Tag";
