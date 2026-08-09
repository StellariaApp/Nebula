import type { ReactNode } from "react";

import type { PermissionProps } from "@stellaria/nebula-tokens";

import type { OverlayTriggerElement, PopoverPlacement } from "../Popover/Popover.types.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

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

/**
 * The slots of every row. They spread over ALL of them: rows arrive through `items`, not through
 * composition, so there is no way to adjust a single one from outside.
 *
 * The row itself has NO slot: motion animates it with a staggered entrance, and a prop there would
 * let the consumer override the stagger.
 */
export interface MenuSlotProps {
  /** Wrapper for the icon, when the row has one. */
  iconProps?: BoxSlotProps | undefined;
  /** Label and description column. */
  bodyProps?: BoxSlotProps | undefined;
  /** The label. It spreads AFTER the aria props, so the consumer wins. */
  labelProps?: TextSlotProps | undefined;
  /** The description, when the row has one. */
  descriptionProps?: TextSlotProps | undefined;
  /** The keyboard shortcut, rendered in a `kbd`. */
  shortcutProps?: BoxSlotProps | undefined;
}

export interface MenuListOwnProps extends MenuSlotProps {
  /** The list. It already carries the aria menu props. */
  listProps?: BoxSlotProps | undefined;
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
