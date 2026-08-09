import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { PermissionProps } from "@stellaria/nebula-tokens";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { KbdProps } from "../Kbd/Kbd.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface CommandItem extends PermissionProps {
  key: string;
  label: string;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  shortcut?: string | undefined;
  group?: string | undefined;
  keywords?: readonly string[] | undefined;
  disabled?: boolean | undefined;
  onAction?: (() => void) | undefined;
}

export interface CommandPaletteLabels {
  placeholder: string;
  search: string;
  empty: string;
  list: string;
}

/**
 * The slots of every row. They spread over ALL of them: rows come from `items` filtered by the
 * search, not from composition, so there is no way to adjust a single one from outside.
 *
 * The names are the ones `Menu` uses, which has the same row anatomy; the shared contract wins over
 * the class name.
 */
export interface CommandPaletteSlotProps {
  /** Every row. It carries `data-focused` and `data-disabled`, and the aria option props already. */
  optionProps?: ComponentPropsWithoutRef<"li"> | undefined;
  /** Wrapper for the icon, when the command has one. */
  iconProps?: BoxSlotProps | undefined;
  /** Label and description column. */
  bodyProps?: BoxSlotProps | undefined;
  /** The command label. */
  labelProps?: TextSlotProps | undefined;
  /** The description, when the command has one. */
  descriptionProps?: TextSlotProps | undefined;
  /** The shortcut, rendered with `Kbd`. Only when the command has a `shortcut`. */
  shortcutProps?: Omit<KbdProps, "children"> | undefined;
}

export interface CommandPaletteProps extends CommandPaletteSlotProps {
  /** The search row: the magnifier and the field. */
  inputRowProps?: BoxSlotProps | undefined;
  /** The magnifier glyph of that row, which is not the icon of the command rows. */
  searchIconProps?: BoxSlotProps | undefined;
  /** The search field. It spreads AFTER the aria combobox props. */
  inputProps?: ComponentPropsWithoutRef<"input"> | undefined;
  /** The no-results notice. It replaces the list, it is not added to it. */
  emptyProps?: TextSlotProps | undefined;
  /** The command list. It spreads AFTER the aria listbox props. */
  listProps?: ComponentPropsWithoutRef<"ul"> | undefined;
  items: readonly CommandItem[];
  opened?: boolean | undefined;
  defaultOpened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  onAction?: ((key: string) => void) | undefined;
  hotkey?: string | false | undefined;
  maxResults?: number | undefined;
  labels?: Partial<CommandPaletteLabels> | undefined;
  className?: string | undefined;
}
