"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";

import * as styles from "../AppShell.css.js";
import type { AppShellSectionProps } from "../AppShell.types.js";

export function AppShellSection(props: AppShellSectionProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <section className={cx(styles.section, sprinkle_class, className)} style={style} {...rest}>
      {children}
    </section>
  );
}
