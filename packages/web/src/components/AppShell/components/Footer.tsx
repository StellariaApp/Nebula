"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";
import { GlassSurface } from "../../GlassSurface/GlassSurface.js";

import * as styles from "../AppShell.css.js";
import type { AppShellFooterContentProps, AppShellFooterProps } from "../AppShell.types.js";

export function AppShellFooter(props: AppShellFooterProps): ReactElement {
  const { children, level = "default", className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <GlassSurface
      component="footer"
      level={level}
      r={0}
      className={cx(styles.footer, sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </GlassSurface>
  );
}

export function AppShellFooterContent(props: AppShellFooterContentProps): ReactElement {
  const { children, className, ...rest } = props;
  return (
    <Box {...rest} className={cx(styles.footer_content, className)}>
      {children}
    </Box>
  );
}
