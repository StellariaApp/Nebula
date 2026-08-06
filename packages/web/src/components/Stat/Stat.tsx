"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Stat.css.js";
import type { StatProps, StatTrend } from "./Stat.types.js";

const ARROW: Record<StatTrend, string> = { up: "▲", down: "▼", flat: "→" };
const TREND_LABEL: Record<StatTrend, string> = {
  up: "al alza",
  down: "a la baja",
  flat: "sin cambios",
};

export function Stat(props: StatProps): ReactElement {
  const {
    label,
    value,
    description,
    icon,
    trend,
    diff,
    diffLabel,
    size = "md",
    align = "start",
    className,
    labelProps,
    valueProps,
    descriptionProps,
    iconProps,
    diffProps,
    headProps,
    footProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <div
      className={cx(styles.root, styles.align[align], sprinkle_class, className)}
      style={sprinkle_style}
    >
      <div {...headProps} className={cx(styles.head, headProps?.className)}>
        <span {...labelProps} className={cx(styles.label, labelProps?.className)}>
          {label}
        </span>
        {icon === undefined || icon === null ? null : (
          <span aria-hidden="true" {...iconProps} className={cx(styles.icon, iconProps?.className)}>
            {icon}
          </span>
        )}
      </div>
      <span {...valueProps} className={cx(styles.value, styles.size[size], valueProps?.className)}>
        {value}
      </span>
      {diff === undefined && description === undefined ? null : (
        <div {...footProps} className={cx(styles.foot, footProps?.className)}>
          {diff === undefined ? null : (
            <span
              data-trend={trend ?? "flat"}
              {...diffProps}
              className={cx(styles.diff, diffProps?.className)}
            >
              <span className={styles.arrow} aria-hidden="true">
                {ARROW[trend ?? "flat"]}
              </span>
              {diff}
              <VisuallyHidden>{diffLabel ?? TREND_LABEL[trend ?? "flat"]}</VisuallyHidden>
            </span>
          )}
          {description === undefined ? null : (
            <span
              {...descriptionProps}
              className={cx(styles.description, descriptionProps?.className)}
            >
              {description}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

Stat.displayName = "Stat";
