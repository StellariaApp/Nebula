"use client";

import type { CSSProperties, ReactElement } from "react";

import { useTheme } from "@stellaria/nebula-hooks";
import { AnimatePresence, m, useReducedMotion, type MotionStyle } from "motion/react";

import { ExitTween, MotionOff, Spring } from "../../utils/motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { ButtonClose } from "../ButtonClose/ButtonClose.js";
import { Portal } from "../Portal/Portal.js";

import * as styles from "./Dialog.css.js";
import type { DialogCorner, DialogProps } from "./Dialog.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

function Placement(corner: DialogCorner, offset: number): CSSProperties {
  const gap = `${String(offset)}px`;
  const vertical = corner.startsWith("top") ? { top: gap } : { bottom: gap };
  const horizontal = corner.endsWith("start") ? { left: gap } : { right: gap };
  return { ...vertical, ...horizontal };
}

export function Dialog(props: DialogProps): ReactElement {
  const {
    opened,
    onClose,
    children,
    title,
    corner = "bottom-end",
    offset = 24,
    width = 340,
    zIndex = 300,
    withCloseButton = true,
    closeLabel = "Cerrar",
    withinPortal = true,
    live = "polite",
    className,
    headProps,
    titleProps,
    "aria-label": aria_label,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const { theme } = useTheme();
  const prefers_reduced = useReducedMotion();
  const motion_context = { theme, reduced: prefers_reduced === true };
  const is_off = MotionOff(motion_context);
  const from_top = corner.startsWith("top");

  const node = (
    <AnimatePresence>
      {opened ? (
        <m.div
          className={cx(styles.dialog, sprinkle_class, className)}
          style={
            {
              ...Placement(corner, offset),
              width,
              zIndex,
              ...sprinkle_style,
            } as MotionStyle
          }
          role="status"
          aria-live={live}
          {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
          initial={is_off ? false : { opacity: 0, y: from_top ? -12 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={is_off ? { opacity: 1 } : { opacity: 0, y: from_top ? -8 : 8 }}
          transition={opened ? Spring("gentle", motion_context) : ExitTween("fast", motion_context)}
        >
          {title === undefined && !withCloseButton ? null : (
            <Box {...headProps} className={cx(styles.head, headProps?.className)}>
              {title === undefined ? (
                <span />
              ) : (
                <Text {...titleProps} className={cx(styles.title, titleProps?.className)}>
                  {title}
                </Text>
              )}
              {withCloseButton && onClose !== undefined ? (
                <ButtonClose size="sm" aria-label={closeLabel} onPress={onClose} />
              ) : null}
            </Box>
          )}
          {children}
        </m.div>
      ) : null}
    </AnimatePresence>
  );

  return withinPortal ? <Portal>{node}</Portal> : node;
}

Dialog.displayName = "Dialog";
