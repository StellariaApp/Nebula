"use client";

import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Charts.css.js";
import * as charts_vars from "./Charts.vars.css.js";
import type { ChartLegendProps } from "./Charts.types.js";

export function ChartLegend(props: ChartLegendProps): ReactElement {
  const { entries, hidden = [], onToggle, label, className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const interactive = onToggle !== undefined;

  return (
    <ul
      className={cx(styles.legend, sprinkle_class, className)}
      style={sprinkle_style}
      {...(label === undefined ? {} : { "aria-label": label })}
      {...rest}
    >
      {entries.map((entry) => {
        const off = hidden.includes(entry.key);
        return (
          <li key={entry.key}>
            <button
              type="button"
              className={styles.legend_item}
              data-interactive={interactive ? "true" : "false"}
              disabled={!interactive}
              {...(interactive ? { "aria-pressed": off } : {})}
              onClick={() => {
                onToggle?.(entry.key);
              }}
            >
              <span
                className={styles.swatch}
                style={assignInlineVars({ [charts_vars.swatchColor]: entry.color })}
                aria-hidden="true"
              />
              {entry.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

ChartLegend.displayName = "ChartLegend";
