"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import * as styles from "../AppShell.css.js";
import type { AppShellContentProps } from "../AppShell.types.js";

export function AppShellContent(props: AppShellContentProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <div className={cx(styles.content, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </div>
  );
}
