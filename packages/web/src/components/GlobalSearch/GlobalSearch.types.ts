import type { ComponentPropsWithoutRef, ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";
import type { TextSlotProps } from "../Text/Text.types.js";

export interface GlobalSearchResult {
  id: string;
  title: string;
  description?: ReactNode | undefined;
  icon?: ReactNode | undefined;
  group?: string | undefined;
  /**
   * Turns the result into a real link, so it answers to a middle click and to «open in a new tab».
   * Whoever claims the result owns the navigation: with `onSelect` —on the result or on the
   * component— the default is prevented and the consumer routes; without it, the browser follows.
   */
  href?: string | undefined;
  onSelect?: (() => void) | undefined;
}

export interface GlobalSearchLabels {
  trigger: string;
  input: string;
  placeholder: string;
  empty: string;
  loading: string;
  recent: string;
  results: (count: number) => string;
  shortcut: string;
}

export interface GlobalSearchProps extends StyleProps {
  results: readonly GlobalSearchResult[];
  onQueryChange: (query: string) => void;
  onSelect?: ((result: GlobalSearchResult) => void) | undefined;
  opened?: boolean | undefined;
  onOpenChange?: ((opened: boolean) => void) | undefined;
  query?: string | undefined;
  loading?: boolean | undefined;
  /** @default 250 */
  debounce?: number | undefined;
  recent?: readonly GlobalSearchResult[] | undefined;
  withTrigger?: boolean | undefined;
  withShortcut?: boolean | undefined;
  empty?: ReactNode | undefined;
  labels?: Partial<GlobalSearchLabels> | undefined;
  className?: string | undefined;
  /** The button that opens the search. Only exists with `withTrigger`; turn it off if you open it from elsewhere. */
  triggerProps?: ComponentPropsWithoutRef<"button"> | undefined;
  /** The keyboard shortcut on the trigger. Only with `withShortcut`. */
  shortcutProps?: BoxSlotProps | undefined;
  /** The search field row, inside the panel. */
  searchRowProps?: BoxSlotProps | undefined;
  /** Icon wrapper. It lands on the magnifier AND on the icon of every result. */
  iconProps?: BoxSlotProps | undefined;
  /** The search field, which is the `combobox`. */
  inputProps?: ComponentPropsWithoutRef<"input"> | undefined;
  /** The result list, which is the `listbox`. */
  listProps?: BoxSlotProps | undefined;
  /** The label of each group. It spreads over all of them. */
  groupLabelProps?: TextSlotProps | undefined;
  /** Every result. It spreads over all of them; the active one carries `aria-selected`. */
  optionProps?: BoxSlotProps | undefined;
  /** Title and description column of each result. */
  optionBodyProps?: BoxSlotProps | undefined;
  /** The title of each result. */
  optionTitleProps?: TextSlotProps | undefined;
  /** The description of each result, when it has one. */
  optionDescriptionProps?: TextSlotProps | undefined;
  /** The no-results notice. Only rendered when there are none and it is not loading. */
  statusProps?: TextSlotProps | undefined;
}
