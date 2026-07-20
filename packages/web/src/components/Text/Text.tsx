import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type ReactElement,
  type Ref,
} from "react";

import { Cx } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";

import * as styles from "./Text.css.js";
import type { TextOwnProps, TextProps } from "./Text.types.js";

const TextImpl = forwardRef<HTMLElement, TextOwnProps>(function Text(props, ref) {
  const { component, className, truncate, lines, inherit, style, ...rest } =
    props as TextOwnProps & { style?: CSSProperties };

  const is_clamped = typeof lines === "number" && lines > 0;

  return (
    <Box
      ref={ref}
      component={component ?? "p"}
      className={Cx(
        styles.text,
        inherit === true && styles.inheritStyles,
        is_clamped ? styles.clamp : truncate === true && styles.truncate,
        className,
      )}
      style={is_clamped ? { ...style, WebkitLineClamp: lines } : style}
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
