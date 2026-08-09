"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { GlassSurface } from "../../GlassSurface/GlassSurface.js";

import * as styles from "../AppShell.css.js";
import type { AppShellNavProps } from "../AppShell.types.js";
import { useAppShell } from "../AppShellContext.js";

export function AppShellAside(props: AppShellNavProps): ReactElement {
  const { children, level = "subtle", className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  const shell = useAppShell();
  return (
    <GlassSurface
      component="aside"
      aria-label={shell.complementaryLabel}
      level={level}
      r={0}
      className={cx(styles.aside_region, sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </GlassSurface>
  );
}
