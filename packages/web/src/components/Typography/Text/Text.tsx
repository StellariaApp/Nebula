import { forwardRef, type ElementType, type ReactElement, type Ref } from "react";

import { Box } from "../../Layout/Box/Box.js";
import { cx } from "../../../utils/style-props.js";

import * as styles from "./Text.css.js";
import type { TextOwnProps, TextProps } from "./Text.types.js";

/**
 * Primitivo tipográfico construido sobre Box: añade truncado/clamp y el modo
 * `inherit`. Todas las props de tipografía (`fz`/`fw`/`lh`/`ls`/`ta`/`c`…) las
 * resuelve el sprinkles compartido de Box.
 *
 * Presentacional puro: server-safe, sin `"use client"`.
 */
const TextImpl = forwardRef<HTMLElement, TextOwnProps>(function Text(props, ref) {
  const { component, className, truncate, lines, inherit, style, ...rest } = props as TextOwnProps & {
    style?: React.CSSProperties;
  };

  const clamped = typeof lines === "number" && lines > 0;

  return (
    <Box
      ref={ref}
      component={component ?? "p"}
      className={cx(
        styles.text,
        inherit === true && styles.inheritStyles,
        clamped ? styles.clamp : truncate === true && styles.truncate,
        className,
      )}
      style={clamped ? { ...style, WebkitLineClamp: lines } : style}
      {...rest}
    />
  );
});

interface TextComponent {
  <C extends ElementType = "p">(props: TextProps<C> & { ref?: Ref<Element> }): ReactElement;
  displayName?: string;
}

export const Text = TextImpl as unknown as TextComponent;
Text.displayName = "Text";
