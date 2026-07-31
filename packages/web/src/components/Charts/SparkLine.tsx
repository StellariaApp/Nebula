"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ResolveAccent } from "../../utils/scale.js";

import * as styles from "./Charts.css.js";
import type { SparkLineProps } from "./Charts.types.js";

export function Points(
  data: readonly number[],
  width: number,
  height: number,
  padding: number,
): string {
  if (data.length === 0) return "";
  if (data.length === 1) {
    const mid = height / 2;
    return `${String(padding)},${String(mid)} ${String(width - padding)},${String(mid)}`;
  }

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const usable_w = width - padding * 2;
  const usable_h = height - padding * 2;

  return data
    .map((value, index) => {
      const x = padding + (index / (data.length - 1)) * usable_w;
      const y = padding + usable_h - ((value - min) / span) * usable_h;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function SparkLine(props: SparkLineProps): ReactElement {
  const {
    data,
    color = "primary",
    width = 96,
    height = 28,
    strokeWidth = 2,
    withArea = false,
    label,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const padding = strokeWidth;
  const points = Points(data, width, height, padding);
  const stroke = ResolveAccent(color, "500");
  const named = label !== undefined;

  return (
    <svg
      className={cx(styles.spark, sprinkle_class, className)}
      style={sprinkle_style}
      width={width}
      height={height}
      viewBox={`0 0 ${String(width)} ${String(height)}`}
      preserveAspectRatio="none"
      {...(named ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      {withArea && points !== "" ? (
        <polygon
          points={`${String(padding)},${String(height - padding)} ${points} ${String(width - padding)},${String(height - padding)}`}
          fill={stroke}
          fillOpacity={0.15}
        />
      ) : null}
      {points === "" ? null : (
        <polyline
          points={points}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

SparkLine.displayName = "SparkLine";
