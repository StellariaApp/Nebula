"use client";

import { useMemo, type ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Countdown.css.js";
import { COUNTDOWN_LABELS } from "./labels.js";
import { useCountdown } from "./useCountdown.js";
import type { CountdownProps } from "./Countdown.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const PAD = 2;

function Pad(value: number): string {
  return String(value).padStart(PAD, "0");
}

export function Countdown(props: CountdownProps): ReactElement {
  const {
    to,
    onComplete,
    withDays = true,
    withSeconds = true,
    finished,
    size = "md",
    labels,
    className,
    unitProps,
    valueProps,
    captionProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  const text = useMemo(
    () => (labels === undefined ? COUNTDOWN_LABELS : { ...COUNTDOWN_LABELS, ...labels }),
    [labels],
  );

  const parts = useCountdown(to, onComplete);
  const done = parts.total <= 0;

  const units = [
    ...(withDays ? [{ key: "days", value: parts.days, label: text.days }] : []),
    { key: "hours", value: parts.hours, label: text.hours },
    { key: "minutes", value: parts.minutes, label: text.minutes },
    ...(withSeconds ? [{ key: "seconds", value: parts.seconds, label: text.seconds }] : []),
  ];

  return (
    <div
      className={cx(styles.root, styles.size[size], sprinkle_class, className)}
      style={sprinkle_style}
      role="timer"
      data-finished={done ? "true" : "false"}
      {...rest}
    >
      {done ? (
        (finished ?? text.finished)
      ) : (
        <>
          {units.map((item) => (
            <Box
              component="span"
              key={item.key}
              aria-hidden="true"
              {...unitProps}
              className={cx(styles.unit, unitProps?.className)}
            >
              <Text
                component="span"
                {...valueProps}
                className={cx(styles.value, valueProps?.className)}
              >
                {Pad(item.value)}
              </Text>
              <Text
                component="span"
                {...captionProps}
                className={cx(styles.caption, captionProps?.className)}
              >
                {item.label}
              </Text>
            </Box>
          ))}
          <VisuallyHidden>{text.remaining(parts)}</VisuallyHidden>
        </>
      )}
    </div>
  );
}

Countdown.displayName = "Countdown";
