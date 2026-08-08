"use client";

import { useEffect, useRef, type ReactElement } from "react";

import { useMediaQuery, useTheme } from "@stellaria/nebula-hooks";

import { MotionOff } from "../../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../../utils/style-props.js";
import { ActionIcon } from "../../ActionIcon/ActionIcon.js";
import { Box } from "../../Box/Box.js";
import { GlassSurface } from "../../GlassSurface/GlassSurface.js";

import * as styles from "../AppShell.css.js";
import type { AppShellSidebarProps, AppShellSlotProps } from "../AppShell.types.js";
import { ChevronRight } from "../../../glyphs/index.js";

const ACTIVE = "[data-active='true']";
const REDUCED = "(prefers-reduced-motion: reduce)";

export function AppShellSidebar(props: AppShellSidebarProps): ReactElement {
  const {
    children,
    collapsed = false,
    onCollapse,
    collapseLabels = { collapse: "Colapsar la barra", expand: "Expandir la barra" },
    className,
    toggleProps,
    collapseProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);

  return (
    <aside className={cx(styles.sidebar, sprinkle_class, className)} style={style} {...rest}>
      {onCollapse === undefined ? null : (
        <Box {...toggleProps} className={cx(styles.toggle, toggleProps?.className)}>
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
            {...collapseProps}
          >
            <ChevronRight />
          </ActionIcon>
        </Box>
      )}
      <div className={styles.sidebar_container}>{children}</div>
    </aside>
  );
}

export function AppShellSidebarHeader(props: AppShellSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <GlassSurface
      component="header"
      level="default"
      radius={0}
      withBorder={false}
      className={cx(styles.sidebar_slot, styles.sidebar_header, sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </GlassSurface>
  );
}

export function AppShellSidebarFooter(props: AppShellSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
  return (
    <GlassSurface
      component="footer"
      level="default"
      radius={0}
      withBorder={false}
      className={cx(styles.sidebar_slot, styles.sidebar_footer, sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </GlassSurface>
  );
}

export function AppShellSidebarBody(props: AppShellSlotProps): ReactElement {
  const { children, className, ...style_rest } = props;
  const { className: sprinkle_class, style, rest } = ExtractStyleProps(style_rest);
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
    <div
      ref={ref}
      className={cx(styles.sidebar_body, sprinkle_class, className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
