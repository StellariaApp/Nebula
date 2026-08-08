"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { GlassSurface } from "../../GlassSurface/GlassSurface.js";
import { Text } from "../../Text/Text.js";
import { Title } from "../../Title/Title.js";

import * as styles from "../AppShell.css.js";
import type { AppShellHeaderProps } from "../AppShell.types.js";
import { Box } from "../../Box/Box.js";

export function AppShellHeader(props: AppShellHeaderProps): ReactElement {
  const {
    title,
    subtitle,
    order = 2,
    actions,
    children,
    level = "strong",
    sticky = false,
    className,
    contentProps,
    titleProps,
    subtitleProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <GlassSurface
      component="header"
      level={level}
      radius={0}
      className={cx(
        styles.section_header,
        sticky && styles.sticky_chrome,
        sprinkle_class,
        className,
      )}
      style={style}
      {...rest}
    >
      {children ?? (
        <Box {...contentProps} className={cx(styles.section_content, contentProps?.className)}>
          {title === undefined ? null : (
            <Title order={order} fz="h6" {...titleProps}>
              {title}
            </Title>
          )}
          {subtitle === undefined ? null : (
            <Text fz="body2" c="text.secondary" {...subtitleProps}>
              {subtitle}
            </Text>
          )}
        </Box>
      )}
      {actions}
    </GlassSurface>
  );
}
