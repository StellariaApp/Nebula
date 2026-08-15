"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import type { BoxSlotProps } from "../../Box/Box.types.js";
import * as styles from "../AppShell.css.js";

export function AppShellMain(props: BoxSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <main className={cx(styles.main, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </main>
  );
}
