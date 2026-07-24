"use client";

import { cloneElement, useRef, type ReactElement } from "react";

import {
  DismissButton,
  mergeProps,
  Overlay,
  useDialog,
  useOverlayTrigger,
  usePopover,
} from "react-aria";
import { useOverlayTriggerState } from "react-stately";

import { cx } from "../../utils/style-props.js";
import { FocusTrap } from "../FocusTrap/FocusTrap.js";

import * as styles from "./Popover.css.js";
import type { PopoverProps } from "./Popover.types.js";

export function Popover(props: PopoverProps): ReactElement {
  const {
    trigger,
    children,
    opened,
    defaultOpened = false,
    onOpenChange,
    placement = "bottom",
    offset = 8,
    crossOffset,
    shouldFlip = true,
    containerPadding,
    withArrow = false,
    isNonModal,
    isKeyboardDismissDisabled,
    radius = "md",
    padding = "md",
    width,
    className,
    "aria-label": aria_label,
  } = props;

  const state = useOverlayTriggerState({
    ...(opened === undefined ? { defaultOpen: defaultOpened } : { isOpen: opened }),
    ...(onOpenChange === undefined ? {} : { onOpenChange }),
  });

  const trigger_ref = useRef<HTMLElement>(null);
  const popover_ref = useRef<HTMLDivElement>(null);
  const arrow_ref = useRef<HTMLDivElement>(null);

  const { triggerProps, overlayProps } = useOverlayTrigger({ type: "dialog" }, state, trigger_ref);

  const {
    popoverProps,
    arrowProps,
    underlayProps,
    placement: resolved_placement,
  } = usePopover(
    {
      triggerRef: trigger_ref,
      popoverRef: popover_ref,
      placement,
      offset,
      shouldFlip,
      ...(withArrow ? { arrowRef: arrow_ref } : {}),
      ...(crossOffset === undefined ? {} : { crossOffset }),
      ...(containerPadding === undefined ? {} : { containerPadding }),
      ...(isNonModal === undefined ? {} : { isNonModal }),
      ...(isKeyboardDismissDisabled === undefined ? {} : { isKeyboardDismissDisabled }),
    },
    state,
  );

  const { dialogProps } = useDialog(
    aria_label === undefined ? {} : { "aria-label": aria_label },
    popover_ref,
  );

  const Close = (): void => {
    state.close();
  };

  const trigger_node = cloneElement(trigger, { ...triggerProps, ref: trigger_ref });

  return (
    <>
      {trigger_node}
      {state.isOpen ? (
        <Overlay>
          {isNonModal === true ? null : <div {...underlayProps} />}
          <FocusTrap active={isNonModal !== true} restoreFocus autoFocus>
            <div
              {...mergeProps(popoverProps, overlayProps, dialogProps)}
              ref={popover_ref}
              className={cx(styles.popover({ radius, padding }), className)}
              style={{ ...popoverProps.style, ...(width === undefined ? {} : { width }) }}
            >
              <DismissButton onDismiss={Close} />
              {withArrow ? (
                <div
                  {...arrowProps}
                  ref={arrow_ref}
                  className={styles.arrow}
                  data-placement={resolved_placement}
                />
              ) : null}
              {children}
              <DismissButton onDismiss={Close} />
            </div>
          </FocusTrap>
        </Overlay>
      ) : null}
    </>
  );
}

Popover.displayName = "Popover";
