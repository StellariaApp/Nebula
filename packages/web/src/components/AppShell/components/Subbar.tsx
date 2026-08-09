"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { GlassSurface } from "../../GlassSurface/GlassSurface.js";

import * as styles from "../AppShell.css.js";
import type { AppShellSubbarProps } from "../AppShell.types.js";

export function AppShellSubbar(props: AppShellSubbarProps): ReactElement {
  const { children, level = "default", sticky = false, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <GlassSurface
      level={level}
      r={0}
      className={cx(styles.section_sub, sticky && styles.sticky_sub, sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </GlassSurface>
  );
}
