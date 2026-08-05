"use client";

import type { ReactElement } from "react";

import { cx } from "../../../utils/style-props.js";
import { GlassSurface } from "../../GlassSurface/GlassSurface.js";

import * as styles from "../AppShell.css.js";
import type { AppShellSubbarProps } from "../AppShell.types.js";

export function AppShellSubbar(props: AppShellSubbarProps): ReactElement {
  const { children, level = "default", sticky = false, className } = props;
  return (
    <GlassSurface
      level={level}
      radius={0}
      className={cx(styles.section_sub, sticky && styles.sticky_sub, className)}
    >
      {children}
    </GlassSurface>
  );
}
