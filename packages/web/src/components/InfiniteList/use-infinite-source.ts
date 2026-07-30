import type { InfiniteListProps, InfiniteQueryLike } from "./InfiniteList.types.js";

export interface InfiniteSource<T> {
  items: readonly T[];
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  failed: boolean;
  loadMore: (() => void) | undefined;
}

function FlattenPages<T, TPage>(
  query: InfiniteQueryLike<TPage>,
  getPageItems: ((page: TPage) => readonly T[]) | undefined,
): readonly T[] {
  const pages = query.data?.pages;
  if (pages === undefined) return [];
  const take = getPageItems ?? ((page: TPage) => (Array.isArray(page) ? page : []) as readonly T[]);
  return pages.flatMap((page) => [...take(page)]);
}

export function ResolveInfiniteSource<T, TPage>(
  props: Pick<
    InfiniteListProps<T, TPage>,
    | "query"
    | "getPageItems"
    | "items"
    | "hasMore"
    | "loading"
    | "loadingMore"
    | "error"
    | "onLoadMore"
  >,
): InfiniteSource<T> {
  const { query, getPageItems, items, hasMore, loading, loadingMore, error, onLoadMore } = props;

  const from_query = query === undefined ? undefined : FlattenPages<T, TPage>(query, getPageItems);
  const resolved_items = items ?? from_query ?? [];

  const query_loading = query?.isLoading ?? query?.isPending ?? false;
  const fetch_next = query?.fetchNextPage;

  const load_more =
    onLoadMore ??
    (fetch_next === undefined
      ? undefined
      : () => {
          void fetch_next();
        });

  return {
    items: resolved_items,
    hasMore: hasMore ?? query?.hasNextPage ?? false,
    loading: loading ?? query_loading,
    loadingMore: loadingMore ?? query?.isFetchingNextPage ?? false,
    failed: error !== undefined || (query?.isError ?? false),
    loadMore: load_more,
  };
}
