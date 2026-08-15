import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";
import { VisuallyHidden } from "../VisuallyHidden/VisuallyHidden.js";

import * as styles from "./Stat.css.js";
import type { StatProps, StatTrend } from "./Stat.types.js";

const ARROW: Record<StatTrend, string> = { up: "▲", down: "▼", flat: "→" };
const TREND_LABEL: Record<StatTrend, string> = {
  up: "up",
  down: "down",
  flat: "unchanged",
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
      <Box {...headProps} className={cx(styles.head, headProps?.className)}>
        <Text component="span" {...labelProps} className={cx(styles.label, labelProps?.className)}>
          {label}
        </Text>
        {icon === undefined || icon === null ? null : (
          <Box
            component="span"
            aria-hidden="true"
            {...iconProps}
            className={cx(styles.icon, iconProps?.className)}
          >
            {icon}
          </Box>
        )}
      </Box>
      <Text
        component="span"
        {...valueProps}
        className={cx(styles.value, styles.size[size], valueProps?.className)}
      >
        {value}
      </Text>
      {diff === undefined && description === undefined ? null : (
        <Box {...footProps} className={cx(styles.foot, footProps?.className)}>
          {diff === undefined ? null : (
            <Text
              component="span"
              data-trend={trend ?? "flat"}
              {...diffProps}
              className={cx(styles.diff, diffProps?.className)}
            >
              <span className={styles.arrow} aria-hidden="true">
                {ARROW[trend ?? "flat"]}
              </span>
              {diff}
              <VisuallyHidden>{diffLabel ?? TREND_LABEL[trend ?? "flat"]}</VisuallyHidden>
            </Text>
          )}
          {description === undefined ? null : (
            <Text
              component="span"
              {...descriptionProps}
              className={cx(styles.description, descriptionProps?.className)}
            >
              {description}
            </Text>
          )}
        </Box>
      )}
    </div>
  );
}

Stat.displayName = "Stat";
