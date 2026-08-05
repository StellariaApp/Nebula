"use client";

import type { ReactElement } from "react";

import { cx } from "../../../utils/style-props.js";

import * as styles from "../AppShell.css.js";
import type { AppShellSectionProps } from "../AppShell.types.js";

export function AppShellSection(props: AppShellSectionProps): ReactElement {
  const { children, className, ...rest } = props;
  return (
    <section className={cx(styles.section, className)} {...rest}>
      {children}
    </section>
  );
}
