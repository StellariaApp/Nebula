import type { ReactNode } from "react";

import type { StyleProps } from "../../utils/style-props.js";

import type { BoxSlotProps } from "../Box/Box.types.js";

export interface InfiniteQueryLike<TPage> {
  data?: { pages: readonly TPage[] } | undefined;
  fetchNextPage?: (() => unknown) | undefined;
  hasNextPage?: boolean | undefined;
  isFetchingNextPage?: boolean | undefined;
  isLoading?: boolean | undefined;
  isPending?: boolean | undefined;
  isError?: boolean | undefined;
  error?: unknown;
}

export interface InfiniteListLabels {
  loadMore: string;
  loading: string;
  end: string;
}

export interface InfiniteListProps<T, TPage = readonly T[]> extends StyleProps {
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  query?: InfiniteQueryLike<TPage> | undefined;
  getPageItems?: ((page: TPage) => readonly T[]) | undefined;
  items?: readonly T[] | undefined;
  hasMore?: boolean | undefined;
  loading?: boolean | undefined;
  loadingMore?: boolean | undefined;
  error?: ReactNode | undefined;
  onLoadMore?: (() => void) | undefined;
  autoLoad?: boolean | undefined;
  rootMargin?: string | undefined;
  empty?: ReactNode | undefined;
  skeleton?: ReactNode | undefined;
  withEndMessage?: boolean | undefined;
  labels?: Partial<InfiniteListLabels> | undefined;
  label?: string | undefined;
  gap?: "none" | "xs" | "sm" | "md" | "lg" | undefined;
  className?: string | undefined;
  /** La lista. Su hueco lo fija `gap`; la ranura se compone con el. */
  listProps?: BoxSlotProps | undefined;
  /** Cada entrada. Se esparce sobre todas; su contenido lo pinta `renderItem`. */
  itemProps?: BoxSlotProps | undefined;
  /** La region que anuncia la carga. Lleva `role="status"`, asi que se lee sola. */
  liveProps?: BoxSlotProps | undefined;
}
