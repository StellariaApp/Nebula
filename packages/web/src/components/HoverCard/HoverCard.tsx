"use client";

import { cloneElement, useRef, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";
import { mergeProps, Overlay, useFocus, useHover, useOverlayPosition } from "react-aria";

import { OverlayMotion, useOverlayPresence } from "../../overlays/overlay-motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./HoverCard.css.js";
import type { HoverCardProps } from "./HoverCard.types.js";

export function HoverCard(props: HoverCardProps): ReactElement {
  const {
    trigger,
    children,
    placement = "bottom",
    offset = 8,
    crossOffset,
    openDelay = 200,
    closeDelay = 150,
    disabled = false,
    opened,
    defaultOpened = false,
    onOpenChange,
    width,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const [is_open, set_open] = useUncontrolled(opened, defaultOpened, onOpenChange);
  const trigger_ref = useRef<HTMLElement>(null);
  const card_ref = useRef<HTMLDivElement>(null);
  const timer_ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  const Schedule = (next: boolean, delay: number): void => {
    if (timer_ref.current !== null) clearTimeout(timer_ref.current);
    timer_ref.current = setTimeout(() => {
      set_open(next);
    }, delay);
  };

  const { hoverProps: trigger_hover } = useHover({
    isDisabled: disabled,
    onHoverStart: () => {
      Schedule(true, openDelay);
    },
    onHoverEnd: () => {
      Schedule(false, closeDelay);
    },
  });

  const { focusProps } = useFocus({
    isDisabled: disabled,
    onFocus: () => {
      Schedule(true, 0);
    },
    onBlur: () => {
      Schedule(false, 0);
    },
  });

  const { hoverProps: card_hover } = useHover({
    onHoverStart: () => {
      Schedule(true, 0);
    },
    onHoverEnd: () => {
      Schedule(false, closeDelay);
    },
  });

  const { overlayProps } = useOverlayPosition({
    targetRef: trigger_ref,
    overlayRef: card_ref,
    placement,
    offset,
    isOpen: is_open,
    ...(crossOffset === undefined ? {} : { crossOffset }),
  });

  const presence = useOverlayPresence(is_open);
  const trigger_node = cloneElement(trigger, {
    ...mergeProps(trigger_hover, focusProps),
    ref: trigger_ref,
  });

  return (
    <>
      {trigger_node}
      {presence.render ? (
        <Overlay>
          <OverlayMotion
            {...mergeProps(overlayProps, card_hover)}
            surface="popover"
            open={is_open}
            onExitComplete={presence.OnExitComplete}
            preset="fade"
            ref={card_ref}
            className={cx(styles.card, sprinkle_class, className)}
            style={{
              ...overlayProps.style,
              ...sprinkle_style,
              ...(width === undefined ? {} : { width }),
            }}
          >
            {children}
          </OverlayMotion>
        </Overlay>
      ) : null}
    </>
  );
}

HoverCard.displayName = "HoverCard";
