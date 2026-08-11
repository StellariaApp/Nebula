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
const SCROLLS = new Set(["auto", "scroll", "overlay"]);

/**
 * El contenedor que scrollea la barra. Se busca a mano porque `scrollIntoView` arrastra a TODOS los
 * ancestros: el grid del carril es `overflow: hidden` y llevarlo ahí desplaza la página entera sin
 * que nadie pueda devolverla.
 */
function Scroller(node: HTMLElement): HTMLElement | null {
  let parent = node.parentElement;
  while (parent !== null) {
    const style = getComputedStyle(parent);
    if (SCROLLS.has(style.overflowY) || SCROLLS.has(style.overflowX)) return parent;
    parent = parent.parentElement;
  }
  return null;
}

/** Lo que hay que mover para que el borde más cercano entre en vista, y cero si ya cabe. */
function Nearest(before: number, after: number): number {
  if (before < 0) return before;
  if (after > 0) return after;
  return 0;
}

export function AppShellSidebar(props: AppShellSidebarProps): ReactElement {
  const {
    children,
    level = "subtle",
    collapsed = false,
    onCollapse,
    collapseLabels = { collapse: "Collapse the sidebar", expand: "Expand the sidebar" },
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
      <GlassSurface level={level} r={0} className={styles.sidebar_container}>
        {children}
      </GlassSurface>
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
      r={0}
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
      r={0}
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
      const scroller = Scroller(root);
      if (target === null || scroller === null) return;

      const box = target.getBoundingClientRect();
      const view = scroller.getBoundingClientRect();
      const top = Nearest(box.top - view.top, box.bottom - view.bottom);
      const left = Nearest(box.left - view.left, box.right - view.right);
      settled = true;
      if (top === 0 && left === 0) return;

      scroller.scrollTo({
        top: scroller.scrollTop + top,
        left: scroller.scrollLeft + left,
        behavior: animate && settled ? "smooth" : "auto",
      });
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
