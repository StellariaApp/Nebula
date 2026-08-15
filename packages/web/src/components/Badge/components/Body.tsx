import type { CSSProperties, ReactElement } from "react";

import { ResolveAccent } from "../../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";

import * as styles from "../Badge.css.js";
import type { BadgeProps } from "../Badge.types.js";

export interface BadgeBodyProps extends BadgeProps {
  /** La clase de la matriz cuando el color es una escala que el tema conoce (ADR-150). */
  tone?: string | undefined;
  /** Las vars en linea cuando el color es arbitrario y hay que resolverlo con el tema. */
  toneStyle?: CSSProperties | undefined;
}

export function BadgeBody(props: BadgeBodyProps): ReactElement {
  const {
    children,
    variant = "light",
    dot = false,
    color = "primary",
    size = "md",
    radius = "full",
    leftSection,
    rightSection,
    fullWidth = false,
    className,
    dotProps,
    leftSectionProps,
    rightSectionProps,
    tone,
    toneStyle,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <span
      className={cx(styles.badge({ size, radius, fullWidth }), tone, sprinkle_class, className)}
      style={{ ...toneStyle, ...sprinkle_style }}
      data-variant={variant}
      data-dot={dot ? "true" : undefined}
    >
      {dot ? (
        <Box
          component="span"
          aria-hidden="true"
          {...dotProps}
          className={cx(styles.dot, dotProps?.className)}
          style={{ color: ResolveAccent(color, "600"), ...dotProps?.style }}
        />
      ) : null}
      {leftSection === undefined || leftSection === null ? null : (
        <Box
          component="span"
          aria-hidden="true"
          {...leftSectionProps}
          className={cx(styles.section, leftSectionProps?.className)}
        >
          {leftSection}
        </Box>
      )}
      {children}
      {rightSection === undefined || rightSection === null ? null : (
        <Box
          component="span"
          {...rightSectionProps}
          className={cx(styles.section, rightSectionProps?.className)}
        >
          {rightSection}
        </Box>
      )}
    </span>
  );
}

BadgeBody.displayName = "Badge.Body";
