"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";

import * as styles from "./Tag.css.js";
import * as variables from "./Tag.vars.css.js";
import type { TagProps } from "./Tag.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

export function Tag(props: TagProps): ReactElement {
  const {
    children,
    variant = "light",
    color = "primary",
    size = "md",
    radius = "full",
    leftSection,
    onRemove,
    removeLabel = "Remove",
    disabled = false,
    className,
    sectionProps,
    labelProps,
    removeProps,
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
      className={cx(
        styles.tag,
        styles.size[size],
        styles.radius[radius],
        sprinkle_class,
        className,
      )}
      style={{ ...css_vars, ...sprinkle_style }}
      data-variant={variant}
      data-disabled={disabled ? "true" : undefined}
      {...(disabled ? { "aria-disabled": true } : {})}
    >
      {leftSection === undefined || leftSection === null ? null : (
        <Box
          component="span"
          aria-hidden="true"
          {...sectionProps}
          className={cx(styles.section, sectionProps?.className)}
        >
          {leftSection}
        </Box>
      )}
      <Text
        inherit
        component="span"
        {...labelProps}
        className={cx(styles.label, labelProps?.className)}
      >
        {children}
      </Text>
      {onRemove === undefined ? null : (
        <ButtonClose
          size={size === "xs" || size === "sm" ? "xs" : "sm"}
          aria-label={
            typeof children === "string" || typeof children === "number"
              ? `${removeLabel}: ${String(children)}`
              : removeLabel
          }
          disabled={disabled}
          onPress={onRemove}
          {...removeProps}
          className={cx(styles.remove, removeProps?.className)}
        />
      )}
    </span>
  );
}

Tag.displayName = "Tag";
