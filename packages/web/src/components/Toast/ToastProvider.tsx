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
import type { ToastProviderProps, ToastRecord, ToastSlotProps } from "./Toast.types.js";
import * as variables from "./Toast.vars.css.js";
import { nebulaToast, useToastQueue } from "./toast-store.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const LIVE: Record<string, "assertive" | "polite"> = { error: "assertive", warning: "assertive" };

interface ItemProps {
  toast: ToastRecord;
  closeLabel: string;
  fallbackDuration: number;
  slots: ToastSlotProps;
}

function ToastItem(props: ItemProps): ReactElement {
  const { toast, closeLabel, fallbackDuration, slots } = props;
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
    [variables.accent]: ResolveAccent(toast.color, "600"),
    ...(resolved === null
      ? {}
      : {
          [variables.bg]: resolved.background,
          [variables.fg]: resolved.foreground,
          [variables.border]: resolved.borderColor,
          [variables.backdrop]: resolved.backdropFilter,
        }),
  });

  return (
    <Box
      {...slots.toastProps}
      className={cx(styles.toast, slots.toastProps?.className)}
      style={{ ...css_vars, ...slots.toastProps?.style }}
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
        <Box
          component="span"
          aria-hidden="true"
          {...slots.iconProps}
          className={cx(styles.icon, slots.iconProps?.className)}
        >
          {toast.icon}
        </Box>
      )}
      <Box {...slots.bodyProps} className={cx(styles.body, slots.bodyProps?.className)}>
        {toast.title === undefined || toast.title === null ? null : (
          <Text
            inherit
            {...slots.titleProps}
            className={cx(styles.title, slots.titleProps?.className)}
          >
            {toast.title}
          </Text>
        )}
        {toast.message === undefined || toast.message === null ? null : (
          <Box
            {...slots.messageProps}
            className={cx(styles.message, slots.messageProps?.className)}
          >
            {toast.message}
          </Box>
        )}
        {toast.action === undefined || toast.action === null ? null : (
          <Box {...slots.actionProps} className={cx(styles.action, slots.actionProps?.className)}>
            {toast.action}
          </Box>
        )}
      </Box>
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
    </Box>
  );
}

export function ToastProvider(props: ToastProviderProps): ReactElement {
  const {
    children,
    position = "bottom-end",
    max = 5,
    duration = 4500,
    closeLabel = "Dismiss notification",
    regionLabel = "Notifications",
    regionProps,
    toastProps,
    iconProps,
    bodyProps,
    titleProps,
    messageProps,
    actionProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const slots: ToastSlotProps = {
    toastProps,
    iconProps,
    bodyProps,
    titleProps,
    messageProps,
    actionProps,
  };

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
        <Box
          {...regionProps}
          className={cx(
            styles.region,
            styles.placement[position],
            sprinkle_class,
            regionProps?.className,
          )}
          style={{ ...sprinkle_style, ...regionProps?.style }}
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
                <ToastItem
                  toast={toast}
                  closeLabel={closeLabel}
                  fallbackDuration={duration}
                  slots={slots}
                />
              </m.div>
            ))}
          </AnimatePresence>
        </Box>
      </Portal>
    </>
  );
}

ToastProvider.displayName = "ToastProvider";
