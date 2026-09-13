"use client";

import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type RefObject,
} from "react";

import { useScrolled, useUncontrolled } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { LengthToCss } from "../../utils/token-css.js";
import { Box } from "../Box/Box.js";

import * as styles from "./AppShell.css.js";
import * as variables from "./AppShell.vars.css.js";
import {
  AppShellContext,
  AppShellScrollContext,
  type AppShellScrollState,
} from "./AppShellContext.js";

import type { AppShellLabels, AppShellProps } from "./AppShell.types.js";
import { AppShellMain } from "./components/Main.js";
import { CHROME_HEIGHT, SIDEBAR_WIDTH } from "./constants.js";

const DEFAULT_LABELS: AppShellLabels = {
  skipToContent: "Skip to content",
  navigation: "Main navigation",
  complementary: "Side panel",
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
    contentWidth,
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
    railCollapse = "mini",
    collapsible = true,
    padded = true,
    labels,
    contentId,
    className,
    skipProps,
    chromeProps,
    mainProps,
    scrollShadowProps,
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

  const main_ref = useRef<HTMLElement | null>(null);
  const [scroller, set_scroller] = useState<RefObject<HTMLElement | null>>(main_ref);
  const Adopt = useCallback((ref: RefObject<HTMLElement | null>) => {
    set_scroller(ref);
    return () => {
      set_scroller((current) => (current === ref ? main_ref : current));
    };
  }, []);
  const scrolled = useScrolled(0, railed ? { scroller } : {});
  const scroll_state = useMemo<AppShellScrollState>(
    () => ({ scrolled, ref: scroller, Adopt }),
    [scrolled, scroller, Adopt],
  );
  const SetMain = useCallback(
    (node: HTMLElement | null) => {
      main_ref.current = node;
      if (mainRef !== undefined) mainRef.current = node;
    },
    [mainRef],
  );

  const shell_state = {
    collapsed,
    navigationLabel: text.navigation,
    complementaryLabel: text.complementary,
    railCollapse,
  };

  const css_vars = assignInlineVars({
    [variables.navWidth]: has_navbar
      ? `${String(collapsed ? collapsedWidth : navbarWidth)}px`
      : "0px",
    [variables.asideWidth]: has_aside ? `${String(asideWidth)}px` : "0px",
    [variables.headHeight]: header === undefined ? "0px" : `${String(headerHeight)}px`,
    [variables.railWidth]: `${String(sidebarWidth)}px`,
    [variables.railMiniWidth]: `${String(sidebarMiniWidth)}px`,
    [variables.chromeHeight]: `${String(chrome)}px`,
    [variables.shadowOffset]: `${String(scrollShadowOffset)}px`,
    ...(contentWidth === undefined ? {} : { [variables.contentMax]: LengthToCss(contentWidth) }),
  });

  if (railed) {
    return (
      <AppShellContext.Provider value={shell_state}>
        <AppShellScrollContext.Provider value={scroll_state}>
          <div
            className={cx(
              styles.rail,
              railCollapse === "hidden" ? styles.rail_hidden : undefined,
              contentWidth === undefined ? undefined : styles.bounded,
              sprinkle_class,
              className,
            )}
            style={{ ...css_vars, ...sprinkle_style }}
            data-sidebar-collapsed={sidebarCollapsed ? "true" : undefined}
            data-rail-collapse={railCollapse}
          >
            <a
              href={`#${content_id}`}
              {...skipProps}
              className={cx(styles.skip, skipProps?.className)}
            >
              {text.skipToContent}
            </a>
            {backdrop}
            {header === undefined ? null : (
              <Box {...chromeProps} className={cx(styles.chrome, chromeProps?.className)}>
                {header}
              </Box>
            )}
            {sidebar}
            <AppShellMain id={content_id} ref={SetMain} tabIndex={-1} {...mainProps}>
              {scrollShadow ? (
                <Box
                  aria-hidden="true"
                  {...scrollShadowProps}
                  className={cx(styles.scroll_shadow, scrollShadowProps?.className)}
                />
              ) : null}
              {children}
            </AppShellMain>
          </div>
        </AppShellScrollContext.Provider>
      </AppShellContext.Provider>
    );
  }

  return (
    <AppShellContext.Provider value={shell_state}>
      <AppShellScrollContext.Provider value={scroll_state}>
        <div
          className={cx(styles.shell, sprinkle_class, className)}
          style={{ ...css_vars, ...sprinkle_style }}
          data-navbar-collapsed={collapsed ? "true" : undefined}
        >
          <a
            href={`#${content_id}`}
            {...skipProps}
            className={cx(styles.skip, skipProps?.className)}
          >
            {text.skipToContent}
          </a>

          {header}
          {navbar}

          <AppShellMain
            id={content_id}
            tabIndex={-1}
            data-padded={padded ? "true" : undefined}
            {...mainProps}
          >
            {children}
          </AppShellMain>

          {aside}
          {footer}
        </div>
      </AppShellScrollContext.Provider>
    </AppShellContext.Provider>
  );
}

AppShell.displayName = "AppShell";
