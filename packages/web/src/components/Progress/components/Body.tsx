import type { CSSProperties, ReactElement } from "react";

import type { Size } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "@stellaria/nebula-themes/web";
import { ResolveAccent } from "../../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { LengthToCss } from "../../../utils/token-css.js";
import { Box } from "../../Box/Box.js";
import { Text } from "../../Text/Text.js";

import * as styles from "../Progress.css.js";
import type { ProgressProps, ProgressSegment } from "../Progress.types.js";
import * as variables from "../Progress.vars.css.js";

const BAR_HEIGHT: Record<Size, number> = { xs: 4, sm: 6, md: 8, lg: 12, xl: 16 };
const RING_SIZE: Record<Size, number> = { xs: 32, sm: 44, md: 60, lg: 84, xl: 112 };

export interface ProgressBodyProps extends ProgressProps {
  /** La clase de la matriz cuando el color es una escala que el tema conoce (ADR-150). */
  tone?: string | undefined;
  /** Las vars en linea cuando el color es arbitrario y hay que resolverlo con el tema. */
  toneStyle?: CSSProperties | undefined;
}

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

function Bar(props: ProgressBodyProps): ReactElement {
  const {
    max = 100,
    size,
    striped = false,
    indeterminate = false,
    label,
    className,
    color = "primary",
    fillProps,
    tone,
    toneStyle,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const list = Normalize(props);
  const total = list.reduce((sum, segment) => sum + segment.value, 0);
  const percent = Math.min(100, Math.max(0, (total / max) * 100));

  const css_vars = assignInlineVars({
    [variables.trackHeight]: Resolve(size, BAR_HEIGHT),
    [variables.trackRadius]: vars.radius.full,
  });

  if (indeterminate) {
    return (
      <div
        className={cx(styles.track, tone, sprinkle_class, className)}
        style={{ ...toneStyle, ...css_vars, ...sprinkle_style }}
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
      className={cx(styles.track, tone, sprinkle_class, className)}
      style={{ ...toneStyle, ...css_vars, ...sprinkle_style }}
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      {...(label === undefined ? {} : { "aria-label": label })}
    >
      {list.map((segment, index) => (
        <Box
          key={segment.label ?? `${String(index)}-${segment.color ?? color}`}
          component="span"
          {...(segment.label === undefined ? { "aria-hidden": true } : { title: segment.label })}
          {...fillProps}
          className={cx(styles.fill, striped && styles.striped, fillProps?.className)}
          style={{
            ...fillProps?.style,
            width: `${String(Math.min(100, Math.max(0, (segment.value / max) * 100)))}%`,
            background: ResolveAccent(segment.color ?? color, "600"),
          }}
        />
      ))}
    </div>
  );
}

function Ring(props: ProgressBodyProps): ReactElement {
  const {
    max = 100,
    size,
    thickness,
    indeterminate = false,
    label,
    children,
    className,
    color = "primary",
    ringLabelProps,
    tone,
    toneStyle,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const list = Normalize(props);
  const box = Number.parseFloat(Resolve(size, RING_SIZE));
  const stroke = thickness ?? Math.max(3, Math.round(box / 9));
  const radius = (box - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = list.reduce((sum, segment) => sum + segment.value, 0);
  const percent = Math.min(100, Math.max(0, (total / max) * 100));

  const css_vars = assignInlineVars({ [variables.ringSize]: `${String(box)}px` });

  let offset = 0;

  return (
    <div
      className={cx(styles.ring, tone, sprinkle_class, className)}
      style={{ ...toneStyle, ...css_vars, ...sprinkle_style }}
      role="progressbar"
      {...(indeterminate
        ? {}
        : { "aria-valuenow": Math.round(percent), "aria-valuemin": 0, "aria-valuemax": 100 })}
      {...(label === undefined ? {} : { "aria-label": label })}
    >
      <svg
        className={cx(styles.ring_svg, indeterminate && styles.ring_spin)}
        viewBox={`0 0 ${String(box)} ${String(box)}`}
        aria-hidden="true"
      >
        <circle
          className={styles.ring_track}
          cx={box / 2}
          cy={box / 2}
          r={radius}
          fill="none"
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
              className={styles.ring_arc}
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
        <Text
          component="span"
          {...ringLabelProps}
          className={cx(styles.ring_label, ringLabelProps?.className)}
        >
          {children}
        </Text>
      )}
    </div>
  );
}

export function ProgressBody(props: ProgressBodyProps): ReactElement {
  return props.type === "ring" ? Ring(props) : Bar(props);
}

ProgressBody.displayName = "Progress.Body";
