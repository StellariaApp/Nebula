"use client";

import type { ReactElement } from "react";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Box } from "../Box/Box.js";
import { ActionIcon } from "../ActionIcon/ActionIcon.js";
import { Filters } from "../Filters/Filters.js";
import { SearchInput } from "../SearchInput/SearchInput.js";

import * as styles from "./Search.css.js";
import type { SearchLabels, SearchProps } from "./Search.types.js";
import { Refresh } from "../../glyphs/index.js";

const DEFAULT_LABELS: SearchLabels = {
  placeholder: "Buscar",
  search: "Buscar",
  refresh: "Actualizar",
};

const ICON_REFRESH = <Refresh />;

export function Search(props: SearchProps): ReactElement {
  const {
    value,
    defaultValue,
    onChange,
    onSearch,
    debounce,
    filters,
    filterState,
    defaultFilterState,
    onFilterChange,
    filterAccessors,
    hideSearch = false,
    loading = false,
    onRefresh,
    size = "md",
    top,
    bottom,
    before,
    after,
    children,
    labels,
    className,
    barProps,
    beforeProps,
    afterProps,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_LABELS, ...labels };
  const has_filters = filters !== undefined && filters.length > 0;

  return (
    <div
      className={cx(styles.root, sprinkle_class, className)}
      style={sprinkle_style}
      data-loading={loading ? "true" : undefined}
    >
      {top}
      <Box {...barProps} className={cx(styles.bar, barProps?.className)}>
        {before === undefined ? null : (
          <Box {...beforeProps} className={cx(styles.slot, beforeProps?.className)}>
            {before}
          </Box>
        )}

        {hideSearch ? null : (
          <SearchInput
            rootClassName={styles.field}
            size={size}
            placeholder={text.placeholder}
            aria-label={text.search}
            {...(value === undefined ? {} : { value })}
            {...(defaultValue === undefined ? {} : { defaultValue })}
            {...(onChange === undefined ? {} : { onChange })}
            {...(onSearch === undefined ? {} : { onSearch })}
            {...(debounce === undefined ? {} : { debounce })}
          />
        )}

        {has_filters ? (
          <Filters
            filters={filters}
            size={size}
            loading={loading}
            {...(filterState === undefined ? {} : { state: filterState })}
            {...(defaultFilterState === undefined ? {} : { defaultState: defaultFilterState })}
            {...(onFilterChange === undefined ? {} : { onChange: onFilterChange })}
            {...(filterAccessors === undefined ? {} : { accessors: filterAccessors })}
          />
        ) : null}

        {onRefresh === undefined ? null : (
          <ActionIcon
            variant="ghost"
            size={size}
            aria-label={text.refresh}
            loading={loading}
            onPress={onRefresh}
          >
            {ICON_REFRESH}
          </ActionIcon>
        )}

        {after === undefined ? null : (
          <Box {...afterProps} className={cx(styles.slot, afterProps?.className)}>
            {after}
          </Box>
        )}
      </Box>
      {children}
      {bottom}
    </div>
  );
}

Search.displayName = "Search";
