"use client";

import { useEffect, useRef, type ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { assignInlineVars } from "@vanilla-extract/dynamic";
import { AnimatePresence, m, useReducedMotion } from "motion/react";

import { ResolveVariant } from "../../theme/resolve-variant.js";
import { ResolveAccent } from "../../utils/scale.js";
import { SurfaceTransition } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";
import { Portal } from "../Portal/Portal.js";

import * as styles from "./Toast.css.js";
import type { ToastProviderProps, ToastRecord } from "./Toast.types.js";
import { toastAccent, toastBackdrop, toastBg, toastBorder, toastFg } from "./Toast.vars.css.js";
import { nebulaToast, useToastQueue } from "./toast-store.js";

const LIVE: Record<string, "assertive" | "polite"> = { error: "assertive", warning: "assertive" };

interface ItemProps {
  toast: ToastRecord;
  closeLabel: string;
  fallbackDuration: number;
}

function ToastItem(props: ItemProps): ReactElement {
  const { toast, closeLabel, fallbackDuration } = props;
  const paused = useRef(false);

  useEffect(() => {
    const ms = toast.duration > 0 ? toast.duration : fallbackDuration;
    if (ms === Number.POSITIVE_INFINITY || ms <= 0) return;
    const timer = setTimeout(() => {
      if (!paused.current) nebulaToast.dismiss(toast.id);
    }, ms);
    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, toast.duration, fallbackDuration]);

  const { theme } = useTheme();
  const resolved =
    toast.variant === undefined ? null : ResolveVariant(toast.variant, toast.color, theme);

  const css_vars = assignInlineVars({
    [toastAccent]: ResolveAccent(toast.color, "600"),
    ...(resolved === null
      ? {}
      : {
          [toastBg]: resolved.background,
          [toastFg]: resolved.foreground,
          [toastBorder]: resolved.borderColor,
          [toastBackdrop]: resolved.backdropFilter,
        }),
  });

  return (
    <div
      className={styles.toast}
      style={css_vars}
      role={LIVE[toast.color] === "assertive" ? "alert" : "status"}
      data-color={toast.color}
      onMouseEnter={() => {
        paused.current = true;
      }}
      onMouseLeave={() => {
        paused.current = false;
      }}
    >
      {toast.icon === undefined || toast.icon === null ? null : (
        <span className={styles.icon} aria-hidden="true">
          {toast.icon}
        </span>
      )}
      <div className={styles.body}>
        {toast.title === undefined || toast.title === null ? null : (
          <p className={styles.title}>{toast.title}</p>
        )}
        {toast.message === undefined || toast.message === null ? null : (
          <div className={styles.message}>{toast.message}</div>
        )}
        {toast.action === undefined || toast.action === null ? null : (
          <div className={styles.action}>{toast.action}</div>
        )}
      </div>
      {toast.dismissible ? (
        <ButtonClose
          aria-label={closeLabel}
          size="sm"
          variant="ghost"
          onPress={() => {
            nebulaToast.dismiss(toast.id);
          }}
        />
      ) : null}
    </div>
  );
}

export function ToastProvider(props: ToastProviderProps): ReactElement {
  const {
    children,
    position = "bottom-end",
    max = 5,
    duration = 4500,
    closeLabel = "Cerrar notificación",
    regionLabel = "Notificaciones",
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const queue = useToastQueue();
  const visible = queue.slice(-max);

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const from_top = position.startsWith("top");
  const hidden = { opacity: 0, y: from_top ? -16 : 16, scale: 0.96 };

  return (
    <>
      {children}
      <Portal>
        <div
          className={cx(styles.region, styles.placement[position], sprinkle_class)}
          style={sprinkle_style}
          role="region"
          aria-label={regionLabel}
        >
          <AnimatePresence initial={false}>
            {visible.map((toast) => (
              <m.div
                key={toast.id}
                layout
                initial={hidden}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{
                  ...hidden,
                  scale: 0.94,
                  transition: SurfaceTransition("toast", "exit", motion_context),
                }}
                transition={SurfaceTransition("toast", "enter", motion_context)}
              >
                <ToastItem toast={toast} closeLabel={closeLabel} fallbackDuration={duration} />
              </m.div>
            ))}
          </AnimatePresence>
        </div>
      </Portal>
    </>
  );
}

ToastProvider.displayName = "ToastProvider";
