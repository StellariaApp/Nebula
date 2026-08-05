"use client";

import { Children, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { LengthToCss } from "../../utils/token-css.js";
import { cx } from "../../utils/style-props.js";

import { Avatar, ResolveAvatarSize } from "./Avatar.js";
import * as styles from "./Avatar.css.js";
import type { AvatarGroupProps } from "./Avatar.types.js";
import * as variables from "./Avatar.vars.css.js";

const DEFAULT_OVERLAP = 0.3;

export function AvatarGroup(props: AvatarGroupProps): ReactElement {
  const { children, max, total, size, spacing, className, "aria-label": aria_label } = props;

  const items = Children.toArray(children);
  const shown = max === undefined ? items : items.slice(0, max);
  const count = total ?? items.length;
  const rest = count - shown.length;

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
      className={cx(styles.group, className)}
      style={css_vars}
      {...(aria_label === undefined ? {} : { role: "group", "aria-label": aria_label })}
    >
      {shown}
      {rest > 0 ? (
        <Avatar size={size} alt={`+${String(rest)}`}>
          <span aria-hidden="true">+{String(rest)}</span>
        </Avatar>
      ) : null}
    </span>
  );
}

AvatarGroup.displayName = "AvatarGroup";
