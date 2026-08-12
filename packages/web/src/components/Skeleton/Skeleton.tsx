import type { ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { LengthToCss } from "../../utils/token-css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Skeleton.css.js";
import type { SkeletonProps } from "./Skeleton.types.js";
import * as variables from "./Skeleton.vars.css.js";

const LAST_LINE_WIDTH = "62%";

export function Skeleton(props: SkeletonProps): ReactElement {
  const {
    loading = true,
    children,
    width = "100%",
    height = "1em",
    circle = false,
    animation = "shimmer",
    lines = 1,
    label = "Loading content",
    className,
    lineProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  if (!loading) return <>{children}</>;

  const css_vars = assignInlineVars({
    [variables.width]: LengthToCss(width),
    [variables.height]: LengthToCss(height),
    [variables.radius]: circle ? vars.radius.full : vars.radius.sm,
  });

  const block = styles.skeleton({ animation, circle });

  if (lines > 1) {
    return (
      <div
        className={cx(styles.stack, sprinkle_class, className)}
        style={sprinkle_style}
        role="status"
        aria-label={label}
      >
        {Array.from({ length: lines }, (_, index) => (
          <Box
            key={index}
            component="span"
            aria-hidden="true"
            {...lineProps}
            className={cx(block, lineProps?.className)}
            style={{
              ...css_vars,
              ...(index === lines - 1 ? { width: LAST_LINE_WIDTH } : {}),
              ...lineProps?.style,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={cx(block, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      role="status"
      aria-label={label}
    />
  );
}

Skeleton.displayName = "Skeleton";
