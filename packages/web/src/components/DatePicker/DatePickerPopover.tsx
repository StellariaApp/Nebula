"use client";

import { useRef, type ReactElement, type ReactNode, type RefObject } from "react";

import { DismissButton, Overlay, useDialog, usePopover } from "react-aria";
import type { AriaDialogProps } from "react-aria";
import type { OverlayTriggerState } from "react-stately";

import { OverlayMotion, useOverlayPresence } from "../../overlays/overlay-motion.js";
import { cx } from "../../utils/style-props.js";
import type { BoxSlotProps } from "../Box/Box.types.js";
import type { PopoverPlacement } from "../Popover/Popover.types.js";

import * as styles from "./DatePicker.css.js";

export interface DatePickerPopoverProps {
  state: OverlayTriggerState;
  triggerRef: RefObject<HTMLElement | null>;
  dialogProps: AriaDialogProps;
  placement?: PopoverPlacement | undefined;
  slotProps?: BoxSlotProps | undefined;
  children: ReactNode;
}

export function DatePickerPopover(props: DatePickerPopoverProps): ReactElement | null {
  const { state, triggerRef, dialogProps, placement = "bottom start", slotProps, children } = props;

  const popover_ref = useRef<HTMLDivElement>(null);
  const dialog_ref = useRef<HTMLDivElement>(null);

  const { popoverProps: aria_popover, underlayProps } = usePopover(
    { triggerRef, popoverRef: popover_ref, placement, offset: 6 },
    state,
  );

  const { dialogProps: aria_dialog } = useDialog(dialogProps, dialog_ref);
  const presence = useOverlayPresence(state.isOpen);

  if (!presence.render) return null;

  const Close = (): void => {
    state.close();
  };

  return (
    <Overlay>
      {state.isOpen ? <div {...underlayProps} /> : null}
      <OverlayMotion
        {...aria_popover}
        surface="popover"
        open={state.isOpen}
        onExitComplete={presence.OnExitComplete}
        ref={popover_ref}
        {...slotProps}
        className={cx(styles.dialog, slotProps?.className)}
        style={aria_popover.style}
      >
        <DismissButton onDismiss={Close} />
        <div {...aria_dialog} ref={dialog_ref}>
          {children}
        </div>
        <DismissButton onDismiss={Close} />
      </OverlayMotion>
    </Overlay>
  );
}

DatePickerPopover.displayName = "DatePickerPopover";
