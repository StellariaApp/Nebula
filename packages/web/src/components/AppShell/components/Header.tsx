"use client";

import type { ReactElement } from "react";

import { cx } from "../../../utils/style-props.js";
import { GlassSurface } from "../../GlassSurface/GlassSurface.js";
import { Text } from "../../Text/Text.js";
import { Title } from "../../Title/Title.js";

import * as styles from "../AppShell.css.js";
import type { AppShellHeaderProps } from "../AppShell.types.js";

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
  } = props;
  return (
    <GlassSurface
      component="header"
      level={level}
      radius={0}
      className={cx(styles.section_header, sticky && styles.sticky_chrome, className)}
    >
      {children ?? (
        <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          {title === undefined ? null : (
            <Title order={order} fz="h6">
              {title}
            </Title>
          )}
          {subtitle === undefined ? null : (
            <Text fz="body2" c="text.secondary">
              {subtitle}
            </Text>
          )}
        </div>
      )}
      {actions}
    </GlassSurface>
  );
}
