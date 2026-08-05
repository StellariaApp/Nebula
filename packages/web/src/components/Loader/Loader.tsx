import type { ReactElement } from "react";

import type { Size } from "@stellaria/nebula-tokens";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { LengthToCss } from "../../utils/token-css.js";
import { ResolveAccent } from "../../utils/scale.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Loader.css.js";
import type { LoaderProps } from "./Loader.types.js";
import * as variables from "./Loader.vars.css.js";

const SIZE: Record<Size, number> = { xs: 14, sm: 18, md: 24, lg: 32, xl: 44 };

function ResolveSize(size: LoaderProps["size"]): string {
  if (size === undefined) return `${String(SIZE.md)}px`;
  if (typeof size === "string" && size in SIZE) return `${String(SIZE[size as Size])}px`;
  return LengthToCss(size);
}

export function Loader(props: LoaderProps): ReactElement {
  const {
    type = "spinner",
    size,
    color = "primary",
    label = "Cargando",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const css_vars = assignInlineVars({
    [variables.size]: ResolveSize(size),
    [variables.color]: ResolveAccent(color, "600"),
  });

  return (
    <span
      className={cx(styles.root, sprinkle_class, className)}
      style={{ ...css_vars, ...sprinkle_style }}
      role="status"
      aria-label={label}
      data-type={type}
    >
      {type === "spinner" ? <span className={styles.spinner} aria-hidden="true" /> : null}
      {type === "dots"
        ? ([0, 1, 2] as const).map((index) => (
            <span key={index} className={styles.dot[index]} aria-hidden="true" />
          ))
        : null}
      {type === "bars"
        ? ([0, 1, 2, 3] as const).map((index) => (
            <span key={index} className={styles.bar[index]} aria-hidden="true" />
          ))
        : null}
    </span>
  );
}

Loader.displayName = "Loader";
