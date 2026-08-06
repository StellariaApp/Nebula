"use client";

import { useMemo, type ReactElement } from "react";

import { useUncontrolled } from "@stellaria/nebula-hooks";

import { cx, ExtractStyleProps } from "../../utils/style-props.js";
import { Badge } from "../Badge/Badge.js";
import { Button } from "../Button/Button.js";
import { Loader } from "../Loader/Loader.js";
import { Popover } from "../Popover/Popover.js";

import { Filter } from "./Filter.js";
import { ActiveCount, StateAccessors } from "./filter-state.js";
import { DEFAULT_FILTER_LABELS } from "./filter-labels.js";
import * as styles from "./Filters.css.js";
import type { FiltersProps, FilterState } from "./Filters.types.js";
import { Filter as FilterGlyph } from "../../glyphs/index.js";

const EMPTY_STATE: FilterState = {};

const ICON_FILTER = <FilterGlyph />;

export function Filters(props: FiltersProps): ReactElement {
  const {
    filters,
    state,
    defaultState = EMPTY_STATE,
    onChange,
    accessors: outer_accessors,
    size = "sm",
    loading = false,
    placement = "bottom start",
    labels,
    className,
    ...style_rest
  } = props;
  const { className: sprinkle_class, style: sprinkle_style } = ExtractStyleProps(style_rest);

  const text = { ...DEFAULT_FILTER_LABELS, ...labels };
  const [local_state, set_local_state] = useUncontrolled(state, defaultState, onChange);

  const accessors = useMemo(
    () => outer_accessors ?? StateAccessors(local_state, set_local_state),
    [outer_accessors, local_state, set_local_state],
  );

  const keys = useMemo(() => filters.map((entry) => entry.key), [filters]);
  const active = ActiveCount(accessors, keys);

  const trigger = (
    <Button
      variant={active > 0 ? "light" : "outline"}
      size={size}
      leftSection={ICON_FILTER}
      {...(active > 0
        ? {
            rightSection: (
              <Badge size="xs" variant="filled">
                {active}
              </Badge>
            ),
          }
        : {})}
    >
      {text.trigger}
    </Button>
  );

  return (
    <Popover
      trigger={trigger}
      placement={placement}
      width={320}
      padding="md"
      aria-label={text.trigger}
      className={cx(sprinkle_class, className)}
      {...(sprinkle_style === undefined ? {} : { style: sprinkle_style })}
    >
      <div className={styles.panel}>
        {loading ? (
          <Loader size="sm" label={text.trigger} />
        ) : filters.length === 0 ? (
          <p className={styles.empty}>{text.empty}</p>
        ) : (
          <div className={styles.list}>
            {filters.map((entry) => (
              <Filter
                key={entry.key}
                filter={entry}
                accessors={accessors}
                size={size}
                labels={labels}
              />
            ))}
          </div>
        )}
        {active > 0 ? (
          <div className={styles.foot}>
            <Button
              variant="ghost"
              size={size}
              onPress={() => {
                for (const key of keys) accessors.onDelete(key);
              }}
            >
              {text.clearAll}
            </Button>
          </div>
        ) : null}
      </div>
    </Popover>
  );
}

Filters.displayName = "Filters";
