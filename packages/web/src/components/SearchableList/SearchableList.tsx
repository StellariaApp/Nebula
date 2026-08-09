"use client";

import { useMemo, type ReactElement } from "react";

import { useDebounce, useUncontrolled } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { InfiniteList } from "../InfiniteList/InfiniteList.js";
import { SearchInput } from "../SearchInput/SearchInput.js";

import * as styles from "./SearchableList.css.js";
import type { SearchableListLabels, SearchableListProps } from "./SearchableList.types.js";
import { Box } from "../Box/Box.js";
import { Text } from "../Text/Text.js";

const DEFAULT_LABELS: SearchableListLabels = {
  placeholder: "Search",
  search: "Search the list",
  results: (count) => (count === 1 ? "1 resultado" : `${String(count)} resultados`),
};

function DefaultText(item: unknown): string {
  return typeof item === "string" ? item : JSON.stringify(item);
}

export function SearchableList<T, TPage = readonly T[]>(
  props: SearchableListProps<T, TPage>,
): ReactElement {
  const {
    getKey,
    renderItem,
    items,
    query,
    getPageItems,
    mode = "client",
    getSearchText,
    filter,
    search,
    defaultSearch = "",
    onSearchChange,
    debounce = 300,
    minLength = 0,
    size = "md",
    toolbar,
    empty,
    noResults,
    withCount = false,
    labels,
    infinite,
    label,
    className,
    toolbarProps,
    countProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_LABELS, ...labels };
  const [value, set_value] = useUncontrolled(search, defaultSearch);
  const term = useDebounce(value, debounce);

  const source = useMemo(() => {
    if (mode === "server" || items === undefined) return items;
    const trimmed = term.trim();
    if (trimmed.length < minLength || trimmed === "") return items;
    if (filter !== undefined) return items.filter((item) => filter(item, trimmed));
    const read = getSearchText ?? DefaultText;
    const needle = trimmed.toLocaleLowerCase();
    return items.filter((item) => read(item).toLocaleLowerCase().includes(needle));
  }, [mode, items, term, minLength, filter, getSearchText]);

  const searched = value.trim() !== "";
  const is_empty = source !== undefined && source.length === 0;

  return (
    <div className={cx(styles.root, sprinkle_class, className)} style={sprinkle_style}>
      <Box {...toolbarProps} className={cx(styles.toolbar, toolbarProps?.className)}>
        <SearchInput
          className={styles.search}
          rootClassName={styles.search}
          size={size}
          placeholder={text.placeholder}
          aria-label={text.search}
          value={value}
          onChange={set_value}
          debounce={debounce}
          {...(onSearchChange === undefined ? {} : { onSearch: onSearchChange })}
        />
        {toolbar}
      </Box>

      {withCount && source !== undefined ? (
        <Text
          {...countProps}
          aria-live="polite"
          className={cx(styles.count, countProps?.className)}
        >
          {text.results(source.length)}
        </Text>
      ) : null}

      <InfiniteList<T, TPage>
        {...infinite}
        getKey={getKey}
        renderItem={renderItem}
        {...(source === undefined ? {} : { items: source })}
        {...(query === undefined ? {} : { query })}
        {...(getPageItems === undefined ? {} : { getPageItems })}
        {...(label === undefined ? {} : { label })}
        empty={is_empty && searched ? (noResults ?? empty) : empty}
      />
    </div>
  );
}

SearchableList.displayName = "SearchableList";
