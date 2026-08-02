"use client";

import { useEffect, useRef, type ReactElement } from "react";

import { Alert } from "../Alert/Alert.js";
import { Button } from "../Button/Button.js";
import { Loader } from "../Loader/Loader.js";
import { cx, ExtractStyleProps } from "../../utils/style-props.js";

import * as styles from "./InfiniteList.css.js";
import type { InfiniteListLabels, InfiniteListProps } from "./InfiniteList.types.js";
import { ResolveInfiniteSource } from "./use-infinite-source.js";

const DEFAULT_LABELS: InfiniteListLabels = {
  loadMore: "Cargar más",
  loading: "Cargando más elementos",
  end: "No hay más elementos",
};

export function InfiniteList<T, TPage = readonly T[]>(
  props: InfiniteListProps<T, TPage>,
): ReactElement {
  const {
    getKey,
    renderItem,
    query,
    getPageItems,
    items,
    hasMore,
    loading,
    loadingMore,
    error,
    onLoadMore,
    autoLoad = true,
    rootMargin = "200px",
    empty,
    skeleton,
    withEndMessage = false,
    labels,
    label,
    gap = "sm",
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_LABELS, ...labels };
  const source = ResolveInfiniteSource<T, TPage>({
    query,
    getPageItems,
    items,
    hasMore,
    loading,
    loadingMore,
    error,
    onLoadMore,
  });

  const sentinel_ref = useRef<HTMLDivElement | null>(null);
  const load_more = source.loadMore;
  const can_load =
    source.hasMore && !source.loadingMore && !source.loading && load_more !== undefined;

  useEffect(() => {
    if (!autoLoad || !can_load) return;
    const node = sentinel_ref.current;
    if (node === null || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) load_more?.();
      },
      { rootMargin },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, [autoLoad, can_load, load_more, rootMargin]);

  const is_empty = source.items.length === 0;
  const show_end = withEndMessage && !source.hasMore && !is_empty;
  const show_foot = source.loadingMore || can_load || show_end;

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={sprinkle_style}
      data-loading={source.loading ? "true" : undefined}
    >
      {source.loading && is_empty && skeleton !== undefined ? skeleton : null}

      {is_empty && !source.loading && !source.failed ? (
        (empty ?? null)
      ) : (
        <ul
          className={cx(styles.list, styles.gap[gap])}
          aria-busy={source.loadingMore ? "true" : undefined}
          {...(label === undefined ? {} : { "aria-label": label })}
        >
          {source.items.map((entry, index) => (
            <li key={getKey(entry, index)} className={styles.item}>
              {renderItem(entry, index)}
            </li>
          ))}
        </ul>
      )}

      {source.failed && error !== undefined ? (
        <div className={styles.foot}>
          {typeof error === "string" ? <Alert color="error">{error}</Alert> : error}
        </div>
      ) : null}

      <div className={styles.live} aria-live="polite" role="status">
        {source.loadingMore ? text.loading : ""}
      </div>

      {show_foot ? (
        <div className={styles.foot}>
          {source.loadingMore ? (
            <span aria-hidden="true">
              <Loader size="sm" />
            </span>
          ) : null}
          {can_load ? (
            <Button variant="light" size="sm" onPress={load_more}>
              {text.loadMore}
            </Button>
          ) : null}
          {show_end ? <p className={styles.end}>{text.end}</p> : null}
        </div>
      ) : null}

      {autoLoad ? <div ref={sentinel_ref} className={styles.sentinel} aria-hidden="true" /> : null}
    </div>
  );
}

InfiniteList.displayName = "InfiniteList";
