"use client";

import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Indicator.css.js";
import * as variables from "./Indicator.vars.css.js";
import type { IndicatorProps } from "./Indicator.types.js";

export function Indicator(props: IndicatorProps): ReactElement {
  const {
    children,
    label,
    count,
    max = 99,
    showZero = false,
    disabled = false,
    processing = false,
    color = "error",
    size = "md",
    placement = "top-end",
    offset = 0,
    withBorder = true,
    announce,
    className,
    dotProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const numeric = count !== undefined && (count > 0 || showZero);
  const content = label ?? (numeric ? (count > max ? `${String(max)}+` : String(count)) : null);
  const visible = !disabled && (content !== null || count === undefined);

  const css_vars = assignInlineVars({
    [variables.dotColor]: ResolveAccent(color, "600"),
    [variables.dotOffset]: `${String(offset)}px`,
  });

  return (
    <span
      className={cx(styles.root, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
    >
      {children}
      {visible ? (
        <Box
          component="span"
          aria-hidden="true"
          {...dotProps}
          className={cx(
            styles.dot,
            styles.size[size],
            styles.placement[placement],
            content === null ? styles.bare : styles.badge,
            withBorder ? styles.bordered : undefined,
            processing ? styles.processing : undefined,
            dotProps?.className,
          )}
        >
          {content}
        </Box>
      ) : null}
      {visible && announce !== undefined ? <VisuallyHidden>{announce}</VisuallyHidden> : null}
    </span>
  );
}

Indicator.displayName = "Indicator";
