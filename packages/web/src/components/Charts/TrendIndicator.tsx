"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Charts.css.js";
import type { TrendDirection, TrendIndicatorProps } from "./Charts.types.js";

const ARROW: Record<TrendDirection, string> = { up: "▲", down: "▼", flat: "→" };
const SPOKEN: Record<TrendDirection, string> = {
  up: "al alza",
  down: "a la baja",
  flat: "sin cambios",
};

export function Direction(value: number): TrendDirection {
  if (value > 0) return "up";
  if (value < 0) return "down";
  return "flat";
}

function DefaultFormat(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${String(value)} %`;
}

export function TrendIndicator(props: TrendIndicatorProps): ReactElement {
  const {
    value,
    direction,
    format = DefaultFormat,
    invertColors = false,
    label,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const resolved = direction ?? Direction(value);
  const tone: TrendDirection =
    invertColors && resolved !== "flat" ? (resolved === "up" ? "down" : "up") : resolved;

  return (
    <span
      className={cx(styles.trend, sprinkle_class, className)}
      style={sprinkle_style}
      data-direction={tone}
      data-trend={resolved}
    >
      <span className={styles.arrow} aria-hidden="true">
        {ARROW[resolved]}
      </span>
      {format(value)}
      <VisuallyHidden>{label ?? SPOKEN[resolved]}</VisuallyHidden>
    </span>
  );
}

TrendIndicator.displayName = "TrendIndicator";
