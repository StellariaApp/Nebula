"use client";

import { useId, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as variables from "./AppShell.vars.css.js";
import * as styles from "./AppShell.css.js";
import { AppShellContext } from "./AppShellContext.js";

import { CHROME_HEIGHT, SIDEBAR_WIDTH } from "./AppShellRail.js";
import type { AppShellLabels, AppShellProps } from "./AppShell.types.js";

const DEFAULT_LABELS: AppShellLabels = {
  skipToContent: "Saltar al contenido",
  navigation: "Navegación principal",
  complementary: "Panel lateral",
};

export function AppShell(props: AppShellProps): ReactElement {
  const {
    children,
    header,
    navbar,
    aside,
    footer,
    sidebar,
    backdrop,
    sidebarWidth = SIDEBAR_WIDTH,
    chromeHeight: chrome = CHROME_HEIGHT,
    mainRef,
    scrollShadow = true,
    scrollShadowOffset = 0,
    navbarOpened,
    defaultNavbarOpened = true,
    onNavbarChange,
    navbarWidth = 260,
    asideWidth = 300,
    headerHeight = 56,
    collapsedWidth = 0,
    sidebarCollapsed = false,
    sidebarMiniWidth = 76,
    collapsible = true,
    padded = true,
    labels,
    contentId,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_LABELS, ...labels };
  const auto_id = useId();
  const content_id = contentId ?? auto_id;

  const [is_open] = useUncontrolled(navbarOpened, defaultNavbarOpened, onNavbarChange);
  const collapsed = collapsible && !is_open;

  const has_navbar = navbar !== undefined;
  const has_aside = aside !== undefined;

  const railed = sidebar !== undefined;
  const shell_state = {
    collapsed,
    navigationLabel: text.navigation,
    complementaryLabel: text.complementary,
  };

  const css_vars = assignInlineVars({
    [variables.navWidth]: has_navbar ? `${String(collapsed ? collapsedWidth : navbarWidth)}px` : "0px",
    [variables.asideWidth]: has_aside ? `${String(asideWidth)}px` : "0px",
    [variables.headHeight]: header === undefined ? "0px" : `${String(headerHeight)}px`,
    [variables.railWidth]: `${String(sidebarWidth)}px`,
    [variables.railMiniWidth]: `${String(sidebarMiniWidth)}px`,
    [variables.chromeHeight]: `${String(chrome)}px`,
    [variables.shadowOffset]: `${String(scrollShadowOffset)}px`,
  });

  if (railed) {
    return (
      <AppShellContext.Provider value={shell_state}>
        <div
          className={cx(styles.rail, sprinkle_class, className)}
          style={{ ...css_vars, ...sprinkle_style }}
          data-rail-collapsed={sidebarCollapsed ? "true" : undefined}
        >
          <a href={`#${content_id}`} className={styles.skip}>
            {text.skipToContent}
          </a>
          {backdrop}
          {header === undefined ? null : <div className={styles.rail_chrome}>{header}</div>}
          {sidebar}
          <main ref={mainRef} id={content_id} tabIndex={-1} className={styles.main}>
            {scrollShadow ? <div className={styles.scroll_shadow} aria-hidden="true" /> : null}
            {children}
          </main>
        </div>
      </AppShellContext.Provider>
    );
  }

  return (
    <AppShellContext.Provider value={shell_state}>
      <div
        className={cx(styles.shell, sprinkle_class, className)}
        style={{ ...css_vars, ...sprinkle_style }}
        data-navbar-collapsed={collapsed ? "true" : undefined}
      >
        <a href={`#${content_id}`} className={styles.skip}>
          {text.skipToContent}
        </a>

        {header}
        {navbar}

        <main
          id={content_id}
          tabIndex={-1}
          className={styles.main}
          data-padded={padded ? "true" : undefined}
        >
          {children}
        </main>

        {aside}
        {footer}
      </div>
    </AppShellContext.Provider>
  );
}

AppShell.displayName = "AppShell";
