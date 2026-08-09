import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { SelectOption } from "../../collections/options.js";
import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface TransferListLabels {
  add: string;
  addAll: string;
  remove: string;
  removeAll: string;
  search: string;
  empty: string;
  count: (selected: number, total: number) => string;
}

export interface TransferListPane {
  title?: ReactNode | undefined;
  empty?: ReactNode | undefined;
}

/**
 * The slots of a panel. They spread over BOTH — source and target: the component renders them with
 * the same code, so there is no way to adjust only one from outside.
 */
export interface TransferPaneSlotProps {
  /** The panel. */
  paneProps?: BoxSlotProps | undefined;
  /** Its header. Only rendered when the panel has a `title`. */
  paneHeadProps?: BoxSlotProps | undefined;
  /** The panel title. */
  paneTitleProps?: TextSlotProps | undefined;
  /** The count. It goes in the header when there is a title, and in the footer when there is not. */
  paneCountProps?: TextSlotProps | undefined;
  /** The search wrapper. Only with `searchable`. */
  searchProps?: BoxSlotProps | undefined;
  /** The option list, which is the `listbox`. */
  listProps?: BoxSlotProps | undefined;
  /** Every option. It spreads over all of them. */
  itemProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The empty-panel notice. */
  emptyProps?: TextSlotProps | undefined;
}

export interface TransferListProps extends StyleProps, TransferPaneSlotProps {
  data: readonly SelectOption[];
  value?: readonly string[] | undefined;
  defaultValue?: readonly string[] | undefined;
  onChange?: ((value: string[]) => void) | undefined;
  source?: TransferListPane | undefined;
  target?: TransferListPane | undefined;
  searchable?: boolean | undefined;
  height?: number | undefined;
  disabled?: boolean | undefined;
  labels?: Partial<TransferListLabels> | undefined;
  className?: string | undefined;
  /** The button row between the two panels. */
  controlsProps?: BoxSlotProps | undefined;
}
