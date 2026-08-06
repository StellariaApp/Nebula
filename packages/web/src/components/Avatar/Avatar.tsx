"use client";

import { useState, type ReactElement } from "react";

import type { Size } from "@stellaria/nebula-tokens";
import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { ResolveVariant } from "../../theme/resolve-variant.js";
import { LengthToCss } from "../../utils/token-css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Avatar.css.js";
import type { AvatarProps } from "./Avatar.types.js";
import * as variables from "./Avatar.vars.css.js";

const SIZE: Record<Size, string> = {
  xs: vars.size.control.xs,
  sm: vars.size.control.sm,
  md: vars.size.control.md,
  lg: vars.size.control.lg,
  xl: vars.size.control.xl,
};

export function ResolveAvatarSize(size: AvatarProps["size"]): string {
  if (size === undefined) return SIZE.md;
  if (typeof size === "string" && size in SIZE) return SIZE[size as Size];
  return LengthToCss(size);
}

export function Initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? "") : "";
  return `${first}${last}`.toUpperCase();
}

export function Avatar(props: AvatarProps): ReactElement {
  const {
    src,
    alt,
    name,
    children,
    size,
    radius = "full",
    variant = "light",
    color = "primary",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const [failed, set_failed] = useState(false);
  const shows_image = src !== undefined && src !== "" && !failed;

  const { theme } = useTheme();
  const resolved = ResolveVariant(variant, color, theme);

  const css_vars = assignInlineVars({
    [variables.size]: ResolveAvatarSize(size),
    [variables.bg]: resolved.background,
    [variables.fg]: resolved.foreground,
    [variables.border]: resolved.borderColor,
    [variables.borderWidth]: resolved.borderWidth,
  });

  const initials = name === undefined ? "" : Initials(name);
  const label = alt ?? name;

  return (
    <span
      className={cx(styles.avatar({ radius }), sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      {...(shows_image || label === undefined ? {} : { role: "img", "aria-label": label })}
    >
      {shows_image ? (
        <img
          className={styles.image}
          src={src}
          alt={label ?? ""}
          onError={() => {
            set_failed(true);
          }}
        />
      ) : (
        (children ?? (initials === "" ? null : <span aria-hidden="true">{initials}</span>))
      )}
    </span>
  );
}

Avatar.displayName = "Avatar";
