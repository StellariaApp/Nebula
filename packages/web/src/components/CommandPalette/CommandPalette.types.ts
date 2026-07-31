import type { ReactNode } from "react";

import type { PermissionProps } from "@stellaria/nebula-tokens";

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

export interface CommandPaletteProps {
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
