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
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

export function LoadingOverlay(props: LoadingOverlayProps): ReactElement {
  const {
    visible,
    label = "Loading",
    loader,
    color = "surface.base",
    opacity = 0.75,
    blur = "sm",
    r = 0,
    zIndex = 100,
    className,
    bodyProps,
    loaderProps,
    labelProps,
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
          transition={
            visible ? Tween("fast", "standard", motion_context) : ExitTween("fast", motion_context)
          }
        >
          <Overlay
            color={color}
            opacity={opacity}
            blur={blur}
            r={r}
            zIndex={zIndex}
            center
          >
            <Box
              aria-live="polite"
              {...bodyProps}
              role="status"
              className={cx(styles.body, bodyProps?.className)}
            >
              <Box component="span" aria-hidden="true" {...loaderProps}>
                {loader ?? <Loader size="md" />}
              </Box>
              <Text
                inherit
                component="span"
                {...labelProps}
                className={cx(styles.label, labelProps?.className)}
              >
                {label}
              </Text>
            </Box>
          </Overlay>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

LoadingOverlay.displayName = "LoadingOverlay";
