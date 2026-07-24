"use client";

import { cloneElement, useRef, type ReactElement } from "react";

import { mergeProps, Overlay, useOverlayPosition, useTooltip, useTooltipTrigger } from "react-aria";
import { useTooltipTriggerState } from "react-stately";

import { cx } from "../../utils/style-props.js";

import * as styles from "./Tooltip.css.js";
import type { TooltipProps } from "./Tooltip.types.js";

export function Tooltip(props: TooltipProps): ReactElement {
  const {
    trigger,
    label,
    placement = "top",
    offset = 8,
    crossOffset,
    delay,
    closeDelay,
    disabled = false,
    opened,
    defaultOpened,
    onOpenChange,
    withArrow = false,
    color = "neutral",
    maw,
    className,
  } = props;

  const state = useTooltipTriggerState({
    isDisabled: disabled,
    ...(delay === undefined ? {} : { delay }),
    ...(closeDelay === undefined ? {} : { closeDelay }),
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

  const trigger_node = cloneElement(trigger, { ...triggerProps, ref: trigger_ref });

  return (
    <>
      {trigger_node}
      {state.isOpen ? (
        <Overlay>
          <div
            {...mergeProps(trigger_tooltip_props, tooltipProps, overlayProps)}
            ref={tooltip_ref}
            className={cx(styles.tooltip({ color }), className)}
            style={{ ...overlayProps.style, ...(maw === undefined ? {} : { maxWidth: maw }) }}
          >
            {label}
            {withArrow ? (
              <div {...arrowProps} className={styles.arrow} data-placement={resolved_placement} />
            ) : null}
          </div>
        </Overlay>
      ) : null}
    </>
  );
}

Tooltip.displayName = "Tooltip";
