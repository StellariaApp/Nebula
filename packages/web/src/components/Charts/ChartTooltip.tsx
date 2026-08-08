"use client";

import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Charts.css.js";
import * as charts_vars from "./Charts.vars.css.js";
import type { ChartTooltipProps } from "./Charts.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

export function ChartTooltip(props: ChartTooltipProps): ReactElement {
  const { title, items, format, className, titleProps, rowProps, valueProps, ...style_rest } =
    props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  return (
    <div
      className={cx(styles.tooltip, sprinkle_class, className)}
      style={sprinkle_style}
      role="tooltip"
      {...rest}
    >
      {title === undefined ? null : (
        <Text {...titleProps} className={cx(styles.tooltip_title, titleProps?.className)}>
          {title}
        </Text>
      )}
      {items.map((item) => (
        <Box key={item.key} {...rowProps} className={cx(styles.tooltip_row, rowProps?.className)}>
          <span
            className={styles.swatch}
            style={assignInlineVars({ [charts_vars.swatchColor]: item.color })}
            aria-hidden="true"
          />
          <span>{item.label}</span>
          <Text
            inherit
            component="span"
            {...valueProps}
            className={cx(styles.tooltip_value, valueProps?.className)}
          >
            {format === undefined ? String(item.value) : format(item.value, item.key)}
          </Text>
        </Box>
      ))}
    </div>
  );
}

ChartTooltip.displayName = "ChartTooltip";
