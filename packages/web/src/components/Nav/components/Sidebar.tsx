"use client";

import { useEffect, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { AnimatePresence, m, useReducedMotion } from "motion/react";

import { ExitTween, MotionOff, Spring } from "../../../utils/motion.js";
import { cx } from "../../../utils/style-props.js";
import { ButtonClose } from "../../ButtonClose/ButtonClose.js";
import { Portal } from "../../Portal/Portal.js";

import * as styles from "../Nav.css.js";
import type { NavSidebarProps } from "../Nav.types.js";

const QUERY = { phone: 575, tablet: 767, laptop: 1023 } as const;

export function NavSidebar(props: NavSidebarProps): ReactElement {
  const {
    opened,
    onClose,
    children,
    footer,
    collapse = "tablet",
    closeLabel = "Cerrar la navegación",
    label = "Navegación",
    className,
  } = props;

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const is_off = MotionOff(motion_context);

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
              initial={is_off ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={Spring("snappy", motion_context)}
            >
              <div className={styles.sidebar_head}>
                <ButtonClose size="sm" aria-label={closeLabel} onPress={onClose} />
              </div>
              <div className={styles.sidebar_body}>{children}</div>
              {footer === undefined ? null : (
                <div className={styles.sidebar_footer}>{footer}</div>
              )}
            </m.aside>
          </>
        ) : null}
      </AnimatePresence>
    </Portal>
  );
}

NavSidebar.displayName = "Nav.Sidebar";
