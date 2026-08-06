import type { ReactNode } from "react";

import type { Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { FilterAccessors, FilterDescriptor, FilterState } from "../Filters/Filters.types.js";

export interface SearchLabels {
  placeholder: string;
  search: string;
  refresh: string;
}

export interface SearchProps extends Omit<StyleProps, "top" | "bottom"> {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onChange?: ((value: string) => void) | undefined;
  onSearch?: ((value: string) => void) | undefined;
  debounce?: number | undefined;
  filters?: readonly FilterDescriptor[] | undefined;
  filterState?: FilterState | undefined;
  defaultFilterState?: FilterState | undefined;
  onFilterChange?: ((state: FilterState) => void) | undefined;
  filterAccessors?: FilterAccessors | undefined;
  hideSearch?: boolean | undefined;
  loading?: boolean | undefined;
  onRefresh?: (() => void) | undefined;
  size?: Size | undefined;
  top?: ReactNode | undefined;
  bottom?: ReactNode | undefined;
  before?: ReactNode | undefined;
  after?: ReactNode | undefined;
  children?: ReactNode | undefined;
  labels?: Partial<SearchLabels> | undefined;
  className?: string | undefined;
}
