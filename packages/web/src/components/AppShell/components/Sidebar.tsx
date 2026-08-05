"use client";

import type { ReactElement } from "react";

import { cx } from "../../../utils/style-props.js";
import { ActionIcon } from "../../ActionIcon/ActionIcon.js";
import { Box } from "../../Box/Box.js";
import { GlassSurface } from "../../GlassSurface/GlassSurface.js";

import * as styles from "../AppShell.css.js";
import type { AppShellSidebarProps, AppShellSlotProps } from "../AppShell.types.js";

export function AppShellSidebar(props: AppShellSidebarProps): ReactElement {
  const {
    children,
    collapsed = false,
    onCollapse,
    collapseLabels = { collapse: "Colapsar la barra", expand: "Expandir la barra" },
    className,
    ...rest
  } = props;

  return (
    <aside className={cx(styles.sidebar, className)} {...rest}>
      {onCollapse === undefined ? null : (
        <Box className={styles.toggle}>
          <ActionIcon
            variant="glass"
            size="sm"
            r="full"
            aria-label={collapsed ? collapseLabels.expand : collapseLabels.collapse}
            aria-expanded={!collapsed}
            onPress={() => {
              onCollapse(!collapsed);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              width="1em"
              height="1em"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </ActionIcon>
        </Box>
      )}
      <div className={styles.sidebar_container}>{children}</div>
    </aside>
  );
}

export function AppShellSidebarHeader(props: AppShellSlotProps): ReactElement {
  const { children, className } = props;
  return (
    <GlassSurface
      component="header"
      level="default"
      radius={0}
      withBorder={false}
      className={cx(styles.sidebar_slot, styles.sidebar_header, className)}
    >
      {children}
    </GlassSurface>
  );
}

export function AppShellSidebarFooter(props: AppShellSlotProps): ReactElement {
  const { children, className } = props;
  return (
    <GlassSurface
      component="footer"
      level="default"
      radius={0}
      withBorder={false}
      className={cx(styles.sidebar_slot, styles.sidebar_footer, className)}
    >
      {children}
    </GlassSurface>
  );
}

export function AppShellSidebarBody(props: AppShellSlotProps): ReactElement {
  const { children, className } = props;
  return <div className={cx(styles.sidebar_body, className)}>{children}</div>;
}
