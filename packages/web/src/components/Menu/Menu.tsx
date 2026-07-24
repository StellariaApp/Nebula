"use client";

import { cloneElement, useRef, type ReactElement } from "react";

import { DismissButton, Overlay, useMenuTrigger, usePopover, type PressEvent } from "react-aria";
import { useMenuTriggerState } from "react-stately";

import { MenuList } from "./MenuList.js";
import type { MenuItemData, MenuProps } from "./Menu.types.js";

export function Menu(props: MenuProps): ReactElement {
  const {
    trigger,
    items,
    onAction,
    opened,
    defaultOpened = false,
    onOpenChange,
    placement = "bottom start",
    offset = 6,
    crossOffset,
    width,
    autoFocus,
    "aria-label": aria_label,
    className,
  } = props;

  const state = useMenuTriggerState({
    ...(opened === undefined ? { defaultOpen: defaultOpened } : { isOpen: opened }),
    ...(onOpenChange === undefined ? {} : { onOpenChange }),
  });

  const trigger_ref = useRef<HTMLElement>(null);
  const popover_ref = useRef<HTMLDivElement>(null);

  const { menuTriggerProps, menuProps } = useMenuTrigger<MenuItemData>({}, state, trigger_ref);

  const { popoverProps, underlayProps } = usePopover(
    {
      triggerRef: trigger_ref,
      popoverRef: popover_ref,
      placement,
      offset,
      ...(crossOffset === undefined ? {} : { crossOffset }),
    },
    state,
  );

  const HandleTriggerPress = (event: PressEvent): void => {
    menuTriggerProps.onPress?.(event);
    if (event.pointerType === "keyboard") state.toggle("first");
  };

  const trigger_node = cloneElement(trigger, {
    ...menuTriggerProps,
    onPress: HandleTriggerPress,
    ref: trigger_ref,
  });

  const Close = (): void => {
    state.close();
  };

  const HandleAction = (key: string): void => {
    onAction?.(key);
    state.close();
  };

  return (
    <>
      {trigger_node}
      {state.isOpen ? (
        <Overlay>
          <div {...underlayProps} />
          <div
            {...popoverProps}
            ref={popover_ref}
            style={{ ...popoverProps.style, ...(width === undefined ? {} : { width }) }}
          >
            <DismissButton onDismiss={Close} />
            <MenuList
              items={items}
              onAction={HandleAction}
              menuProps={menuProps as Record<string, unknown>}
              {...(autoFocus === undefined ? {} : { autoFocus })}
              {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
              {...(className === undefined ? {} : { className })}
            />
            <DismissButton onDismiss={Close} />
          </div>
        </Overlay>
      ) : null}
    </>
  );
}

Menu.displayName = "Menu";
