import type { ReactElement } from "react";

import type { RadiusName } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { vars } from "../../theme/contract.css.js";
import { LengthToCss } from "../../utils/token-css.js";
import { cx } from "../../utils/style-props.js";

import * as styles from "./Skeleton.css.js";
import type { SkeletonProps } from "./Skeleton.types.js";
import { skeletonHeight, skeletonRadius, skeletonWidth } from "./Skeleton.vars.css.js";

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
    label = "Cargando contenido",
    className,
  } = props;

  if (!loading) return <>{children}</>;

  const css_vars = assignInlineVars({
    [skeletonWidth]: LengthToCss(width),
    [skeletonHeight]: LengthToCss(height),
    [skeletonRadius]: ResolveRadius(radius, circle),
  });

  const block = styles.skeleton({ animation, circle });

  if (lines > 1) {
    return (
      <div className={cx(styles.stack, className)} role="status" aria-label={label}>
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

  return <span className={cx(block, className)} style={css_vars} role="status" aria-label={label} />;
}

Skeleton.displayName = "Skeleton";
