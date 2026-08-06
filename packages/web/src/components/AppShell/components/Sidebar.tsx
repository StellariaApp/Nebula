"use client";

import { useEffect, useRef, type ReactElement } from "react";

import { useMediaQuery, useTheme } from "@stellaria/nebula-hooks";

import { MotionOff } from "../../../utils/motion.js";
import { cx } from "../../../utils/style-props.js";
import { ActionIcon } from "../../ActionIcon/ActionIcon.js";
import { Box } from "../../Box/Box.js";
import { GlassSurface } from "../../GlassSurface/GlassSurface.js";

import * as styles from "../AppShell.css.js";
import type { AppShellSidebarProps, AppShellSlotProps } from "../AppShell.types.js";

const ACTIVE = "[data-active='true']";
const REDUCED = "(prefers-reduced-motion: reduce)";

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
            glass="strong"
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
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const reduced = useMediaQuery(REDUCED);
  const animate = !MotionOff({ theme, reduced });

  useEffect(() => {
    const root = ref.current;
    if (root === null) return;

    let settled = false;
    const Reveal = (): void => {
      const target = root.querySelector(ACTIVE);
      if (target === null) return;
      target.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: animate && settled ? "smooth" : "auto",
      });
      settled = true;
    };

    Reveal();
    const observer = new MutationObserver(Reveal);
    observer.observe(root, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["data-active"],
    });
    return () => {
      observer.disconnect();
    };
  }, [animate]);

  return (
    <div ref={ref} className={cx(styles.sidebar_body, className)}>
      {children}
    </div>
  );
}
