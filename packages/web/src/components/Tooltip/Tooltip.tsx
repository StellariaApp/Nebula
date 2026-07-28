"use client";

import { cloneElement, useRef, type ReactElement } from "react";

import { mergeProps, Overlay, useOverlayPosition, useTooltip, useTooltipTrigger } from "react-aria";
import { useTooltipTriggerState } from "react-stately";

import { OverlayMotion, useOverlayPresence } from "../../overlays/overlay-motion.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./Tooltip.css.js";
import type { TooltipProps } from "./Tooltip.types.js";

const OPEN_DELAY = 0;
const CLOSE_DELAY = 150;

export function Tooltip(props: TooltipProps): ReactElement {
  const {
    trigger,
    label,
    placement = "top",
    offset = 8,
    crossOffset,
    delay = OPEN_DELAY,
    closeDelay = CLOSE_DELAY,
    disabled = false,
    opened,
    defaultOpened,
    onOpenChange,
    withArrow = false,
    color = "neutral",
    maw,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const state = useTooltipTriggerState({
    isDisabled: disabled,
    delay,
    closeDelay,
    ...(opened === undefined ? {} : { isOpen: opened }),
    ...(defaultOpened === undefined ? {} : { defaultOpen: defaultOpened }),
    ...(onOpenChange === undefined ? {} : { onOpenChange }),
  });

  const trigger_ref = useRef<HTMLElement>(null);
  const tooltip_ref = useRef<HTMLDivElement>(null);

  const { triggerProps, tooltipProps: trigger_tooltip_props } = useTooltipTrigger(
    { isDisabled: disabled },
    state,
    trigger_ref,
  );

  const { tooltipProps } = useTooltip({}, state);

  const {
    overlayProps,
    arrowProps,
    placement: resolved_placement,
  } = useOverlayPosition({
    targetRef: trigger_ref,
    overlayRef: tooltip_ref,
    placement,
    offset,
    isOpen: state.isOpen,
    ...(crossOffset === undefined ? {} : { crossOffset }),
  });

  const presence = useOverlayPresence(state.isOpen);

  const trigger_node = cloneElement(trigger, { ...triggerProps, ref: trigger_ref });

  return (
    <>
      {trigger_node}
      {presence.render ? (
        <Overlay>
          <OverlayMotion
            {...mergeProps(trigger_tooltip_props, tooltipProps, overlayProps)}
            surface="tooltip"
            open={state.isOpen}
            onExitComplete={presence.OnExitComplete}
            preset="fade"
            ref={tooltip_ref}
            className={cx(styles.tooltip({ color }), sprinkle_class, className)}
            style={{
              ...overlayProps.style,
              ...sprinkle_style,
              ...(maw === undefined ? {} : { maxWidth: maw }),
            }}
          >
            {label}
            {withArrow ? (
              <div {...arrowProps} className={styles.arrow} data-placement={resolved_placement} />
            ) : null}
          </OverlayMotion>
        </Overlay>
      ) : null}
    </>
  );
}

Tooltip.displayName = "Tooltip";
