"use client";

import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Charts.css.js";
import * as charts_vars from "./Charts.vars.css.js";
import type { ChartTooltipProps } from "./Charts.types.js";

export function ChartTooltip(props: ChartTooltipProps): ReactElement {
  const { title, items, format, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  return (
    <div
      className={cx(styles.tooltip, sprinkle_class, className)}
      style={sprinkle_style}
      role="tooltip"
      {...rest}
    >
      {title === undefined ? null : <p className={styles.tooltip_title}>{title}</p>}
      {items.map((item) => (
        <div key={item.key} className={styles.tooltip_row}>
          <span
            className={styles.swatch}
            style={assignInlineVars({ [charts_vars.swatchColor]: item.color })}
            aria-hidden="true"
          />
          <span>{item.label}</span>
          <span className={styles.tooltip_value}>
            {format === undefined ? String(item.value) : format(item.value, item.key)}
          </span>
        </div>
      ))}
    </div>
  );
}

ChartTooltip.displayName = "ChartTooltip";
