"use client";

import type { ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { AnimatePresence, m, useReducedMotion, type MotionStyle } from "motion/react";

import { ExitTween, MotionOff, Tween } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Loader } from "../Loader/Loader.js";
import { Overlay } from "../Overlay/Overlay.js";

import * as styles from "./LoadingOverlay.css.js";
import type { LoadingOverlayProps } from "./LoadingOverlay.types.js";

export function LoadingOverlay(props: LoadingOverlayProps): ReactElement {
  const {
    visible,
    label = "Cargando",
    loader,
    color = "surface.base",
    opacity = 0.75,
    blur = "sm",
    radius = "none",
    zIndex = 100,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const is_off = MotionOff(motion_context);

  return (
    <AnimatePresence>
      {visible ? (
        <m.div
          className={cx(styles.root, sprinkle_class, className)}
          {...(sprinkle_style === undefined ? {} : { style: sprinkle_style as MotionStyle })}
          initial={is_off ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={is_off ? { opacity: 1 } : { opacity: 0 }}
          transition={visible ? Tween("fast", "standard", motion_context) : ExitTween("fast", motion_context)}
        >
          <Overlay
            color={color}
            opacity={opacity}
            blur={blur}
            radius={radius}
            zIndex={zIndex}
            center
          >
            <div role="status" aria-live="polite" className={styles.body}>
              <span aria-hidden="true">{loader ?? <Loader size="md" />}</span>
              <span className={styles.label}>{label}</span>
            </div>
          </Overlay>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

LoadingOverlay.displayName = "LoadingOverlay";
