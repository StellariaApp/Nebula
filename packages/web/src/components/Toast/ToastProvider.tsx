"use client";

import { useEffect, useRef, type ReactElement } from "react";

import { assignInlineVars } from "@vanilla-extract/dynamic";

import { ScaleShade } from "../../utils/scale.js";
import { cx } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";
import { Portal } from "../Portal/Portal.js";
import { Transition } from "../Transition/Transition.js";

import * as styles from "./Toast.css.js";
import type { ToastProviderProps, ToastRecord } from "./Toast.types.js";
import { toastAccent } from "./Toast.vars.css.js";
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

  const css_vars = assignInlineVars({ [toastAccent]: ScaleShade(toast.color, "600") });

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
  } = props;

  const queue = useToastQueue();
  const visible = queue.slice(-max);

  return (
    <>
      {children}
      <Portal>
        <div
          className={cx(styles.region, styles.placement[position])}
          role="region"
          aria-label={regionLabel}
        >
          {visible.map((toast) => (
            <Transition key={toast.id} mounted transition="slide-up">
              <ToastItem toast={toast} closeLabel={closeLabel} fallbackDuration={duration} />
            </Transition>
          ))}
        </div>
      </Portal>
    </>
  );
}

ToastProvider.displayName = "ToastProvider";
