import type { ReactNode } from "react";

import type { Size } from "@stellaria/nebula-tokens";

import type { StyleProps } from "../../utils/style-props.js";
import type { InfiniteListProps, InfiniteQueryLike } from "../InfiniteList/InfiniteList.types.js";

export type SearchableListMode = "client" | "server";

export interface SearchableListLabels {
  placeholder: string;
  search: string;
  results: (count: number) => string;
}

export interface SearchableListProps<T, TPage = readonly T[]> extends StyleProps {
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  items?: readonly T[] | undefined;
  query?: InfiniteQueryLike<TPage> | undefined;
  getPageItems?: ((page: TPage) => readonly T[]) | undefined;
  mode?: SearchableListMode | undefined;
  getSearchText?: ((item: T) => string) | undefined;
  filter?: ((item: T, search: string) => boolean) | undefined;
  search?: string | undefined;
  defaultSearch?: string | undefined;
  onSearchChange?: ((search: string) => void) | undefined;
  debounce?: number | undefined;
  minLength?: number | undefined;
  size?: Size | undefined;
  toolbar?: ReactNode | undefined;
  empty?: ReactNode | undefined;
  noResults?: ReactNode | undefined;
  withCount?: boolean | undefined;
  labels?: Partial<SearchableListLabels> | undefined;
  infinite?:
    | Omit<
        InfiniteListProps<T, TPage>,
        "getKey" | "renderItem" | "items" | "query" | "getPageItems" | "empty"
      >
    | undefined;
  label?: string | undefined;
  className?: string | undefined;
}
