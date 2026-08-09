"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { GlassSurface } from "../../GlassSurface/GlassSurface.js";

import * as styles from "../AppShell.css.js";
import type { AppShellNavProps } from "../AppShell.types.js";
import { useAppShell } from "../AppShellContext.js";

export function AppShellNav(props: AppShellNavProps): ReactElement {
  const { children, level = "subtle", className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  const shell = useAppShell();
  return (
    <GlassSurface
      component="nav"
      level={level}
      r={0}
      className={cx(styles.navbar, sprinkle_class, className)}
      style={style}
      aria-label={shell.navigationLabel}
      {...(shell.collapsed ? { inert: true } : {})}
      {...rest}
    >
      {children}
    </GlassSurface>
  );
}
