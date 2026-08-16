import type { CSSProperties, ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import * as styles from "../ThemeIcon.css.js";
import type { ThemeIconProps } from "../ThemeIcon.types.js";

export interface ThemeIconBodyProps extends Omit<ThemeIconProps, "color"> {
  /** La clase de la matriz cuando el color es una escala que el tema conoce (ADR-150). */
  tone?: string | undefined;
  /** Las vars en linea cuando el color es arbitrario y hay que resolverlo con el tema. */
  toneStyle?: CSSProperties | undefined;
}

export function ThemeIconBody(props: ThemeIconBodyProps): ReactElement {
  const {
    children,
    variant = "light",
    size = "md",
    radius = "md",
    label,
    className,
    tone,
    toneStyle,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <span
      className={cx(
        styles.icon,
        styles.size[size],
        styles.radius[radius],
        tone,
        sprinkle_class,
        className,
      )}
      style={{ ...toneStyle, ...sprinkle_style }}
      data-variant={variant}
      {...(label === undefined ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
    >
      {children}
    </span>
  );
}

ThemeIconBody.displayName = "ThemeIcon.Body";
