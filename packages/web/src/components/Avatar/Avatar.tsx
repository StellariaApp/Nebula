"use client";

import { useState, type ReactElement } from "react";

import type { Size } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ScaleShade } from "../../utils/scale.js";
import { LengthToCss } from "../../utils/token-css.js";
import { cx } from "../../utils/style-props.js";

import * as styles from "./Avatar.css.js";
import type { AvatarProps } from "./Avatar.types.js";
import { avatarBg, avatarFg, avatarSize } from "./Avatar.vars.css.js";

const SIZE: Record<Size, number> = { xs: 24, sm: 32, md: 40, lg: 56, xl: 72 };

export function ResolveAvatarSize(size: AvatarProps["size"]): string {
  if (size === undefined) return `${String(SIZE.md)}px`;
  if (typeof size === "string" && size in SIZE) return `${String(SIZE[size as Size])}px`;
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
  const { src, alt, name, children, size, radius = "full", color = "primary", className } = props;

  const [failed, set_failed] = useState(false);
  const shows_image = src !== undefined && src !== "" && !failed;

  const css_vars = assignInlineVars({
    [avatarSize]: ResolveAvatarSize(size),
    [avatarBg]: `color-mix(in srgb, ${ScaleShade(color, "500")} 18%, transparent)`,
    [avatarFg]: ScaleShade(color, "700"),
  });

  const initials = name === undefined ? "" : Initials(name);
  const label = alt ?? name;

  return (
    <span
      className={cx(styles.avatar({ radius }), className)}
      style={css_vars}
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
