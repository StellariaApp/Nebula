"use client";

import { useEffect, useMemo, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { AnimatePresence, m, useReducedMotion } from "motion/react";

import { ExitTween, MotionOff, Spring } from "../../../utils/motion.js";
import { cx } from "../../../utils/style-props.js";
import { Box } from "../../Box/Box.js";
import { ButtonClose } from "../../ButtonClose/ButtonClose.js";
import { Portal } from "../../Portal/Portal.js";

import { NavLinksContext } from "../Nav.context.js";
import * as styles from "../Nav.css.js";
import type { NavSidebarProps } from "../Nav.types.js";
import { useNavActive, type NavItem } from "../use-nav-active.js";
import { CollectItems } from "./Links.js";

const QUERY = { phone: 575, tablet: 767, laptop: 1023 } as const;

function IgnoreItemRef(): (node: HTMLElement | null) => void {
  return () => undefined;
}

export function NavSidebar(props: NavSidebarProps): ReactElement {
  const {
    opened,
    onClose,
    children,
    footer,
    collapse = "tablet",
    active,
    activeMode = "auto",
    spyOffset,
    pathname,
    closeLabel = "Close navigation",
    label = "Navigation",
    className,
    headProps,
    closeProps,
    bodyProps,
    footerProps,
  } = props;

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const is_off = MotionOff(motion_context);

  const items = useMemo(() => {
    const collected: NavItem[] = [];
    CollectItems(children, collected);
    return collected;
  }, [children]);

  const resolved_active = useNavActive(items, {
    mode: activeMode,
    active,
    offset: spyOffset,
    chrome: undefined,
    pathname,
    enabled: opened,
  });

  const context = useMemo(
    () => ({
      activeHref: resolved_active.href,
      mode: resolved_active.mode,
      SetItemRef: IgnoreItemRef,
    }),
    [resolved_active.href, resolved_active.mode],
  );

  useEffect(() => {
    if (!opened || collapse === "none") return undefined;
    const query = window.matchMedia(`(min-width: ${String(QUERY[collapse] + 1)}px)`);
    const Sync = (): void => {
      if (query.matches) onClose();
    };
    Sync();
    query.addEventListener("change", Sync);
    return () => {
      query.removeEventListener("change", Sync);
    };
  }, [opened, collapse, onClose]);

  return (
    <Portal>
      <AnimatePresence>
        {opened ? (
          <>
            <m.button
              type="button"
              aria-label={closeLabel}
              className={styles.sidebar_scrim}
              onClick={onClose}
              initial={is_off ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={ExitTween("fast", motion_context)}
            />
            <m.aside
              aria-label={label}
              className={cx(styles.sidebar, className)}
              data-mode={resolved_active.mode}
              initial={is_off ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={Spring("snappy", motion_context)}
            >
              <Box {...headProps} className={cx(styles.sidebar_head, headProps?.className)}>
                <ButtonClose size="sm" aria-label={closeLabel} onPress={onClose} {...closeProps} />
              </Box>
              <Box {...bodyProps} className={cx(styles.sidebar_body, bodyProps?.className)}>
                <NavLinksContext.Provider value={context}>{children}</NavLinksContext.Provider>
              </Box>
              {footer === undefined ? null : (
                <Box {...footerProps} className={cx(styles.sidebar_footer, footerProps?.className)}>
                  {footer}
                </Box>
              )}
            </m.aside>
          </>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}

NavSidebar.displayName = "Nav.Sidebar";
