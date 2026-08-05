import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import * as styles from "../Nav.css.js";
import type { NavDividerProps, NavSlotProps } from "../Nav.types.js";

export function NavActions(props: NavSlotProps): ReactElement {
  const { children, collapse = "tablet", className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  return (
    <div
      className={cx(styles.actions({ collapse }), sprinkle_class, className)}
      style={sprinkle_style}
      {...rest}
    >
      {children}
    </div>
  );
}

NavActions.displayName = "NavActions";

export function NavDivider(props: NavDividerProps): ReactElement {
  const { className, ...style_rest } = props;
  const { className: sprinkle_class, style: sprinkle_style, rest } = ExtractStyleProps(style_rest);

  return (
    <span
      aria-hidden="true"
      className={cx(styles.divider, sprinkle_class, className)}
      style={sprinkle_style}
      {...rest}
    />
  );
}

NavDivider.displayName = "NavDivider";
