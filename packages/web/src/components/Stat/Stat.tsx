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
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <div
      className={cx(styles.root, styles.align[align], sprinkle_class, className)}
      style={sprinkle_style}
    >
      <div className={styles.head}>
        <span className={styles.label}>{label}</span>
        {icon === undefined || icon === null ? null : (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
      </div>
      <span className={cx(styles.value, styles.size[size])}>{value}</span>
      {diff === undefined && description === undefined ? null : (
        <div className={styles.foot}>
          {diff === undefined ? null : (
            <span className={styles.diff} data-trend={trend ?? "flat"}>
              <span className={styles.arrow} aria-hidden="true">
                {ARROW[trend ?? "flat"]}
              </span>
              {diff}
              <VisuallyHidden>{diffLabel ?? TREND_LABEL[trend ?? "flat"]}</VisuallyHidden>
            </span>
          )}
          {description === undefined ? null : (
            <span className={styles.description}>{description}</span>
          )}
        </div>
      )}
    </div>
  );
}

Stat.displayName = "Stat";
