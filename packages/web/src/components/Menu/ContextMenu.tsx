"use client";

import { useRef, useState, type KeyboardEvent, type MouseEvent, type ReactElement } from "react";

import { DismissButton, Overlay, useOverlay } from "react-aria";

import { vars } from "../../theme/contract.css.js";

import { MenuList } from "./MenuList.js";
import type { ContextMenuProps } from "./Menu.types.js";

interface Anchor {
  x: number;
  y: number;
}

export function ContextMenu(props: ContextMenuProps): ReactElement {
  const {
    children,
    items,
    onAction,
    disabled = false,
    width,
    autoFocus,
    "aria-label": aria_label,
    className,
  } = props;

  const [anchor, set_anchor] = useState<Anchor | null>(null);
  const overlay_ref = useRef<HTMLDivElement>(null);

  const Close = (): void => {
    set_anchor(null);
  };

  const { overlayProps } = useOverlay(
    { isOpen: anchor !== null, onClose: Close, isDismissable: true },
    overlay_ref,
  );

  const HandleContextMenu = (event: MouseEvent<HTMLDivElement>): void => {
    if (disabled) return;
    event.preventDefault();
    set_anchor({ x: event.clientX, y: event.clientY });
  };

  const HandleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
    if (disabled) return;
    const is_context_key = event.key === "ContextMenu" || (event.shiftKey && event.key === "F10");
    if (!is_context_key) return;
    event.preventDefault();
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    set_anchor({ x: rect.left, y: rect.bottom });
  };

  const HandleAction = (key: string): void => {
    onAction?.(key);
    Close();
  };

  return (
    <>
      <div onContextMenu={HandleContextMenu} onKeyDown={HandleKeyDown}>
        {children}
      </div>
      {anchor === null ? null : (
        <Overlay>
          <div
            {...overlayProps}
            ref={overlay_ref}
            style={{
              position: "fixed",
              left: anchor.x,
              top: anchor.y,
              zIndex: vars.zIndex.dropdown,
              ...(width === undefined ? {} : { width }),
            }}
          >
            <DismissButton onDismiss={Close} />
            <MenuList
              items={items}
              onAction={HandleAction}
              autoFocus={autoFocus ?? "first"}
              {...(aria_label === undefined ? {} : { "aria-label": aria_label })}
              {...(className === undefined ? {} : { className })}
            />
            <DismissButton onDismiss={Close} />
          </div>
        </Overlay>
      )}
    </>
  );
}

ContextMenu.displayName = "ContextMenu";
