import type { ReactElement } from "react";

import type { RadiusName } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { LengthToCss } from "../../utils/token-css.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Skeleton.css.js";
import type { SkeletonProps } from "./Skeleton.types.js";
import * as variables from "./Skeleton.vars.css.js";

const LAST_LINE_WIDTH = "62%";

function ResolveRadius(radius: SkeletonProps["radius"], circle: boolean): string {
  if (circle) return vars.radius.full;
  if (radius === undefined) return vars.radius.sm;
  if (typeof radius === "string" && radius in vars.radius) {
    return vars.radius[radius as RadiusName];
  }
  return LengthToCss(radius);
}

export function Skeleton(props: SkeletonProps): ReactElement {
  const {
    loading = true,
    children,
    width = "100%",
    height = "1em",
    radius,
    circle = false,
    animation = "shimmer",
    lines = 1,
    label = "Loading content",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  if (!loading) return <>{children}</>;

  const css_vars = assignInlineVars({
    [variables.width]: LengthToCss(width),
    [variables.height]: LengthToCss(height),
    [variables.radius]: ResolveRadius(radius, circle),
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
          <span
            key={index}
            className={block}
            style={{
              ...css_vars,
              ...(index === lines - 1 ? { width: LAST_LINE_WIDTH } : {}),
            }}
            aria-hidden="true"
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
