"use client";

import { Children, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { LengthToCss } from "../../utils/token-css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import { Avatar, ResolveAvatarSize } from "./Avatar.js";
import * as styles from "./Avatar.css.js";
import type { AvatarGroupProps } from "./Avatar.types.js";
import * as variables from "./Avatar.vars.css.js";

const DEFAULT_OVERLAP = 0.3;

export function AvatarGroup(props: AvatarGroupProps): ReactElement {
  const {
    children,
    max,
    total,
    size,
    spacing,
    className,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const {
    className: sprinkle_class,
    style: sprinkle_style,
    rest: dom_rest,
  } = ExtractStyleProps(style_rest);

  const items = Children.toArray(children);
  const shown = max === undefined ? items : items.slice(0, max);
  const count = total ?? items.length;
  const hidden = count - shown.length;

  const resolved_size = ResolveAvatarSize(size);

  const css_vars = assignInlineVars({
    [variables.size]: resolved_size,
    [variables.overlap]:
      spacing === undefined
        ? `calc(${resolved_size} * ${String(DEFAULT_OVERLAP)})`
        : LengthToCss(spacing),
  });

  return (
    <span
      className={cx(styles.group, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      {...(aria_label === undefined ? {} : { role: "group", "aria-label": aria_label })}
      {...dom_rest}
    >
      {shown}
      {hidden > 0 ? (
        <Avatar size={size} alt={`+${String(hidden)}`}>
          <span aria-hidden="true">+{String(hidden)}</span>
        </Avatar>
      ) : null}
    </span>
  );
}

AvatarGroup.displayName = "AvatarGroup";
