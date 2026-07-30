import type { ReactNode } from "react";

import type { PermissionProps } from "@stellaria/nebula-tokens";

import type { OverlayTriggerElement, PopoverPlacement } from "../Popover/Popover.types.js";

export interface MenuItemData extends PermissionProps {
  key: string;
  label: ReactNode;
  textValue?: string | undefined;
  description?: ReactNode | undefined;
  shortcut?: string | undefined;
  icon?: ReactNode | undefined;
  disabled?: boolean | undefined;
  danger?: boolean | undefined;
}

export interface MenuListOwnProps {
  items: MenuItemData[];
  onAction?: ((key: string) => void) | undefined;
  autoFocus?: boolean | "first" | "last" | undefined;
  "aria-label"?: string | undefined;
  className?: string | undefined;
}

export interface MenuProps extends MenuListOwnProps {
  trigger: OverlayTriggerElement;
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  placement?: PopoverPlacement | undefined;
  offset?: number | undefined;
  crossOffset?: number | undefined;
  width?: number | string | undefined;
}

export interface ContextMenuProps extends MenuListOwnProps {
  children: ReactNode;
  disabled?: boolean | undefined;
  width?: number | string | undefined;
}
