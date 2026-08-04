"use client";

import type { ReactElement } from "react";

import type { NebulaTheme, Size } from "@stellaria/nebula-tokens";
import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { ResolveVariant } from "../../theme/resolve-variant.js";
import { LengthToCss } from "../../utils/token-css.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Progress.css.js";
import type { ProgressProps, ProgressSegment } from "./Progress.types.js";
import {
  ringSize,
  trackBg,
  trackBorder,
  trackBorderWidth,
  trackHeight,
  trackRadius,
} from "./Progress.vars.css.js";

const BAR_HEIGHT: Record<Size, number> = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16 };
const RING_SIZE: Record<Size, number> = { xs: 32, sm: 44, md: 60, lg: 84, xl: 112 };

function Resolve(size: ProgressProps["size"], scale: Record<Size, number>): string {
  if (size === undefined) return `${String(scale.md)}px`;
  if (typeof size === "string" && size in scale) return `${String(scale[size as Size])}px`;
  return LengthToCss(size);
}

function Normalize(props: ProgressProps): ProgressSegment[] {
  const { segments, value = 0, color = "primary" } = props;
  if (segments !== undefined) return [...segments];
  return [{ value, color }];
}

interface Track {
  vars: Record<string, string>;
  stroke: string;
}

function TrackVars(
  variant: ProgressProps["variant"],
  color: NonNullable<ProgressProps["color"]>,
  theme: NebulaTheme,
): Track {
  if (variant === undefined) return { vars: {}, stroke: vars.color.surface.raised };
  const resolved = ResolveVariant(variant, color, theme);
  return {
    vars: assignInlineVars({
      [trackBg]: resolved.background,
      [trackBorder]: resolved.borderColor,
      [trackBorderWidth]: resolved.borderWidth,
    }),
    stroke: resolved.background === "transparent" ? "none" : resolved.background,
  };
}

function Bar(props: ProgressProps, track: Track): ReactElement {
  const {
    max = 100,
    size,
    radius,
    striped = false,
    indeterminate = false,
    label,
    className,
    color = "primary",
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const list = Normalize(props);
  const total = list.reduce((sum, segment) => sum + segment.value, 0);
  const percent = Math.min(100, Math.max(0, (total / max) * 100));

  const css_vars = assignInlineVars({
    [trackHeight]: Resolve(size, BAR_HEIGHT),
    [trackRadius]: radius === undefined ? vars.radius.full : LengthToCss(radius),
  });

  if (indeterminate) {
    return (
      <div
        className={cx(styles.track, sprinkle_class, className)}
        style={{ ...track.vars, ...css_vars, ...sprinkle_style }}
        role="progressbar"
        {...(label === undefined ? {} : { "aria-label": label })}
      >
        <span
          className={styles.indeterminate}
          style={{ background: ResolveAccent(color, "600") }}
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div
      className={cx(styles.track, sprinkle_class, className)}
      style={{ ...track.vars, ...css_vars, ...sprinkle_style }}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      {...(label === undefined ? {} : { "aria-label": label })}
    >
      {list.map((segment, index) => (
        <span
          key={segment.label ?? `${String(index)}-${segment.color ?? color}`}
          className={cx(styles.fill, striped && styles.striped)}
          style={{
            width: `${String(Math.min(100, Math.max(0, (segment.value / max) * 100)))}%`,
            background: ResolveAccent(segment.color ?? color, "600"),
          }}
          {...(segment.label === undefined ? { "aria-hidden": true } : { title: segment.label })}
        />
      ))}
    </div>
  );
}

function Ring(props: ProgressProps, track: Track): ReactElement {
  const {
    max = 100,
    size,
    thickness,
    indeterminate = false,
    label,
    children,
    className,
    color = "primary",
  } = props;

  const list = Normalize(props);
  const box = Number.parseFloat(Resolve(size, RING_SIZE));
  const stroke = thickness ?? Math.max(3, Math.round(box / 9));
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = list.reduce((sum, segment) => sum + segment.value, 0);
  const percent = Math.min(100, Math.max(0, (total / max) * 100));

  const css_vars = assignInlineVars({ [ringSize]: `${String(box)}px` });

  let offset = 0;

  return (
    <div
      className={cx(styles.ring, className)}
      style={css_vars}
      role="progressbar"
      {...(indeterminate
        ? {}
        : { "aria-valuenow": Math.round(percent), "aria-valuemin": 0, "aria-valuemax": 100 })}
      {...(label === undefined ? {} : { "aria-label": label })}
    >
      <svg
        className={cx(styles.ringSvg, indeterminate && styles.ringSpin)}
        viewBox={`0 0 ${String(box)} ${String(box)}`}
        aria-hidden="true"
      >
        <circle
          cx={box / 2}
          cy={box / 2}
          r={radius}
          fill="none"
          stroke={track.stroke}
          strokeWidth={stroke}
        />
        {(indeterminate ? [{ value: max * 0.25, color }] : list).map((segment, index) => {
          const fraction = Math.min(1, Math.max(0, segment.value / max));
          const dash = fraction * circumference;
          const rotation = (offset / max) * 360;
          offset += segment.value;
          return (
            <circle
              key={`${String(index)}-${segment.color ?? color}`}
              className={styles.ringArc}
              cx={box / 2}
              cy={box / 2}
              r={radius}
              fill="none"
              stroke={ResolveAccent(segment.color ?? color, "600")}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${String(dash)} ${String(circumference - dash)}`}
              transform={`rotate(${String(rotation)} ${String(box / 2)} ${String(box / 2)})`}
            />
          );
        })}
      </svg>
      {children === undefined || children === null ? null : (
        <span className={styles.ringLabel}>{children}</span>
      )}
    </div>
  );
}

export function Progress(props: ProgressProps): ReactElement {
  const { theme } = useTheme();
  const track = TrackVars(props.variant, props.color ?? "primary", theme);
  return props.type === "ring" ? Ring(props, track) : Bar(props, track);
}

Progress.displayName = "Progress";
