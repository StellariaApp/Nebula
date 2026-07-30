import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Kbd.css.js";
import type { KbdProps } from "./Kbd.types.js";

export function Kbd(props: KbdProps): ReactElement {
  const { children, size = "md", className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  return (
    <kbd
      className={cx(styles.kbd, styles.size[size], sprinkle_class, className)}
      style={sprinkle_style}
    >
      {children}
    </kbd>
  );
}

Kbd.displayName = "Kbd";
